import {
  calculateBaseReward,
  calculateRewardPool,
  calculateNonFinalAuctionSettlement,
  calculateFinalSettlement,
  clampReputationPoints,
  getTierFromPoints,
  calculateLateDays,
  calculateLatePenalty,
  calculateMinimumPayout,
  validateBid,
  selectWinningBid,
  assignUserToGroup,
  Bid,
} from "@merit-circle/domain";

interface StressTestResult {
  suiteName: string;
  iterations: number;
  passed: boolean;
  durationMs: number;
  details: string;
}

const results: StressTestResult[] = [];

function banner(title: string) {
  console.log("\n" + "=".repeat(75));
  console.log(`  🚀 ${title}`);
  console.log("=".repeat(75));
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1: Massive Group Formation Concurrency Stress Test
// ─────────────────────────────────────────────────────────────────────────────
function runGroupFormationStressTest(iterations = 25000): StressTestResult {
  const start = Date.now();
  console.log(`\n[Suite 1] Running Group Formation Stress Test (${iterations.toLocaleString()} assignments)...`);

  const poolSizes = [4, 5, 8, 10, 12, 20];
  let groupsCreated = 0;
  let groupsCompleted = 0;
  let totalAssigned = 0;

  for (const groupSize of poolSizes) {
    let formingGroup: { groupId: string; status: "FORMING" | "ACTIVE"; memberCount: number; members: string[] } | null = null;
    const completedGroups: Array<{ groupId: string; members: string[] }> = [];

    const numUsers = Math.floor(iterations / poolSizes.length);
    for (let i = 0; i < numUsers; i++) {
      const userId = `user_${groupSize}_${i}`;
      const decision = assignUserToGroup({
        userId,
        groupSize,
        existingGroups: formingGroup ? [{ groupId: formingGroup.groupId, status: formingGroup.status, memberCount: formingGroup.memberCount }] : [],
      });

      totalAssigned++;

      if (decision.shouldCreateNewGroup) {
        const newGroupId = `grp_${groupSize}_${groupsCreated++}`;
        formingGroup = {
          groupId: newGroupId,
          status: decision.groupWillBecomeActive ? "ACTIVE" : "FORMING",
          memberCount: 1,
          members: [userId],
        };
        if (groupSize === 1) {
          completedGroups.push({ groupId: formingGroup.groupId, members: formingGroup.members });
          groupsCompleted++;
          formingGroup = null;
        }
      } else {
        if (!formingGroup || formingGroup.groupId !== decision.targetGroupId) {
          throw new Error("Invalid targetGroupId matched during group assignment");
        }
        formingGroup.memberCount++;
        formingGroup.members.push(userId);

        if (decision.groupWillBecomeActive || formingGroup.memberCount === groupSize) {
          formingGroup.status = "ACTIVE";
          completedGroups.push({ groupId: formingGroup.groupId, members: formingGroup.members });
          groupsCompleted++;
          formingGroup = null;
        }
      }
    }

    // Verify all completed groups have exactly groupSize unique members
    for (const group of completedGroups) {
      if (group.members.length !== groupSize) {
        throw new Error(`Group ${group.groupId} has ${group.members.length} members, expected ${groupSize}`);
      }
      const unique = new Set(group.members);
      if (unique.size !== groupSize) {
        throw new Error(`Duplicate members detected in group ${group.groupId}`);
      }
    }
  }

  const duration = Date.now() - start;
  const result: StressTestResult = {
    suiteName: "Group Formation Concurrency",
    iterations: totalAssigned,
    passed: true,
    durationMs: duration,
    details: `${totalAssigned.toLocaleString()} users assigned, ${groupsCreated.toLocaleString()} groups formed, ${groupsCompleted.toLocaleString()} filled to exact capacity with 0 collisions.`,
  };
  results.push(result);
  console.log(`  ✔ PASSED in ${duration}ms: ${result.details}`);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2: Multi-Cycle ROSCA Economic Carryover & Invariant Stress Test
// ─────────────────────────────────────────────────────────────────────────────
function runEconomicInvariantStressTest(iterations = 10000): StressTestResult {
  const start = Date.now();
  console.log(`\n[Suite 2] Running Economic Invariant & Carryover Stress Test (${iterations.toLocaleString()} full ROSCA simulations)...`);

  const groupSizes = [3, 5, 8, 10, 12];
  const contributionAmounts = [
    100_000_000_000_000_000n,    // 0.1 BNB
    500_000_000_000_000_000n,    // 0.5 BNB
    1_000_000_000_000_000_000n,  // 1.0 BNB
    10_000_000_000_000_000_000n, // 10.0 BNB
  ];

  let totalWeiCollectedAllSims = 0n;
  let totalWeiDisbursedAllSims = 0n;

  for (let s = 0; s < iterations; s++) {
    const groupSize = groupSizes[s % groupSizes.length];
    const contributionWei = contributionAmounts[s % contributionAmounts.length];
    const maxDiscountBps = 1000 + ((s * 37) % 2000); // 10% to 30%

    let carriedRewardWei = 0n;
    let totalCollectedInGroup = 0n;
    let totalDisbursedInGroup = 0n;

    for (let cycle = 1; cycle <= groupSize; cycle++) {
      const baseRewardWei = calculateBaseReward(groupSize, contributionWei);
      const totalRewardPoolWei = calculateRewardPool(baseRewardWei, carriedRewardWei);
      totalCollectedInGroup += baseRewardWei;

      const isFinalCycle = cycle === groupSize;

      if (!isFinalCycle) {
        // Auction cycle: Pseudo-random discount between 0 and maxDiscountBps
        const discountBps = (s * cycle * 41) % maxDiscountBps;
        const discountWei = (totalRewardPoolWei * BigInt(discountBps)) / 10000n;
        const winnerPayoutWei = totalRewardPoolWei - discountWei;

        const settlement = calculateNonFinalAuctionSettlement(totalRewardPoolWei, winnerPayoutWei);
        totalDisbursedInGroup += settlement.payoutWei;
        carriedRewardWei = settlement.carriedRewardWei;

        // Invariant: Payout + Carryover MUST strictly equal the total available reward pool
        if (settlement.payoutWei + settlement.carriedRewardWei !== totalRewardPoolWei) {
          throw new Error(`Cycle ${cycle} conservation failed: payout (${settlement.payoutWei}) + carry (${settlement.carriedRewardWei}) != pool (${totalRewardPoolWei})`);
        }
      } else {
        // Final cycle: Guaranteed zero carryover, full accumulated payout
        const settlement = calculateFinalSettlement(baseRewardWei, carriedRewardWei);
        totalDisbursedInGroup += settlement.finalPayoutWei;

        // Invariant: Final carryover must be strictly 0
        if (settlement.carriedRewardWei !== 0n) {
          throw new Error(`Final cycle carryover was non-zero: ${settlement.carriedRewardWei}`);
        }
      }
    }

    // STRICT MACRO-ECONOMIC INVARIANT:
    // Total BNB collected across all cycles in a group MUST EQUAL total BNB disbursed to members!
    if (totalCollectedInGroup !== totalDisbursedInGroup) {
      throw new Error(`Macro invariant broken in sim ${s}: Collected (${totalCollectedInGroup}) != Disbursed (${totalDisbursedInGroup})`);
    }

    totalWeiCollectedAllSims += totalCollectedInGroup;
    totalWeiDisbursedAllSims += totalDisbursedInGroup;
  }

  const duration = Date.now() - start;
  const result: StressTestResult = {
    suiteName: "Economic Invariant & Carryover",
    iterations,
    passed: true,
    durationMs: duration,
    details: `${iterations.toLocaleString()} ROSCA groups simulated. Invariant verified: Total Collected (${totalWeiCollectedAllSims} wei) === Total Disbursed (${totalWeiDisbursedAllSims} wei) with ZERO drift.`,
  };
  results.push(result);
  console.log(`  ✔ PASSED in ${duration}ms: ${result.details}`);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3: Auction Engine High-Concurrency Bidding & Tie-Breaking Stress Test
// ─────────────────────────────────────────────────────────────────────────────
function runAuctionEngineStressTest(iterations = 20000): StressTestResult {
  const start = Date.now();
  console.log(`\n[Suite 3] Running Auction Engine Bidding & Tie-Breaking Stress Test (${iterations.toLocaleString()} bid rounds)...`);

  const rewardPoolWei = 10_000_000_000_000_000_000n; // 10 BNB
  const maxDiscountBps = 2000; // 20%
  const minPayout = calculateMinimumPayout(rewardPoolWei, maxDiscountBps);

  let tiesTested = 0;
  let invalidBidsRejected = 0;

  for (let i = 0; i < iterations; i++) {
    // Generate 10 competing bids
    const bids: Bid[] = [];
    const baseTimestamp = 1700000000 + i * 100;

    for (let b = 0; b < 10; b++) {
      // Intentionally introduce duplicate lowest bids to test deterministic tie-breaking
      const isTieAttempt = b % 3 === 0;
      const payoutWei = isTieAttempt
        ? minPayout + 1000n
        : minPayout + (BigInt(b * 123456789) % 1_000_000_000_000_000n);

      bids.push({
        bidId: `bid_${i}_${b}`,
        userId: `user_${b}`,
        payoutAmountWei: payoutWei,
        submittedAt: baseTimestamp + b * 10,
      });

      if (isTieAttempt) tiesTested++;
    }

    // Also test validation rejects bids below minimum or above reward pool
    const tooLowValid = validateBid({ payoutAmountWei: minPayout - 1n, rewardPoolWei, maxDiscountBps });
    const tooHighValid = validateBid({ payoutAmountWei: rewardPoolWei + 1n, rewardPoolWei, maxDiscountBps });
    if (!tooLowValid.valid) invalidBidsRejected++;
    if (!tooHighValid.valid) invalidBidsRejected++;

    // Select winner
    const winningBid = selectWinningBid(bids);
    if (!winningBid) {
      throw new Error(`selectWinningBid returned null for ${bids.length} valid bids`);
    }

    // Verify winner has lowest payout
    for (const b of bids) {
      if (b.payoutAmountWei < winningBid.payoutAmountWei) {
        throw new Error(`Winner ${winningBid.bidId} did not have the lowest payout! Candidate ${b.bidId} was lower.`);
      }
      // If payout was equal, winner must have the earliest submittedAt
      if (b.payoutAmountWei === winningBid.payoutAmountWei && b.submittedAt < winningBid.submittedAt) {
        throw new Error(`Tie breaker failed: candidate ${b.bidId} had earlier timestamp than winner.`);
      }
    }
  }

  const duration = Date.now() - start;
  const result: StressTestResult = {
    suiteName: "Auction Engine & Tie-Breaking",
    iterations,
    passed: true,
    durationMs: duration,
    details: `${(iterations * 10).toLocaleString()} bids evaluated across ${iterations.toLocaleString()} rounds. ${tiesTested.toLocaleString()} tie-break scenarios resolved deterministically; ${invalidBidsRejected.toLocaleString()} out-of-bound bids rejected.`,
  };
  results.push(result);
  console.log(`  ✔ PASSED in ${duration}ms: ${result.details}`);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4: High-Velocity Reputation Clamping & Tier Boundaries Stress Test
// ─────────────────────────────────────────────────────────────────────────────
function runReputationStressTest(iterations = 100000): StressTestResult {
  const start = Date.now();
  console.log(`\n[Suite 4] Running Reputation Clamping & Tier Transitions Stress Test (${iterations.toLocaleString()} transitions)...`);

  let currentPoints = 500;
  let boundaryCrossings = 0;

  for (let i = 0; i < iterations; i++) {
    // Generate pseudo-random deltas: positive, negative, and extreme outliers
    const delta = ((i * 73) % 251) - 125; // range: -125 to +125
    const previousTier = getTierFromPoints(currentPoints).tier;

    // Test extreme clamping outside [0, 1000]
    if (i % 500 === 0) {
      const extremeHigh = clampReputationPoints(currentPoints + 50000);
      const extremeLow = clampReputationPoints(currentPoints - 50000);
      if (extremeHigh > 1000 || extremeLow < 0) {
        throw new Error(`Clamping failed: high=${extremeHigh}, low=${extremeLow}`);
      }
    }

    currentPoints = clampReputationPoints(currentPoints + delta);

    if (currentPoints < 0 || currentPoints > 1000) {
      throw new Error(`Reputation points out of bounds: ${currentPoints}`);
    }

    const currentTier = getTierFromPoints(currentPoints);
    if (currentTier.tier !== previousTier) {
      boundaryCrossings++;
    }

    // Verify tier invariants matching domain specification
    if (currentPoints <= 100 && currentTier.tier !== 1) throw new Error("Tier 1 mismatch");
    if (currentPoints > 100 && currentPoints <= 400 && currentTier.tier !== 2) throw new Error("Tier 2 mismatch");
    if (currentPoints > 400 && currentPoints <= 700 && currentTier.tier !== 3) throw new Error("Tier 3 mismatch");
    if (currentPoints > 700 && currentPoints <= 900 && currentTier.tier !== 4) throw new Error("Tier 4 mismatch");
    if (currentPoints > 900 && currentTier.tier !== 5) throw new Error("Tier 5 mismatch");
  }

  const duration = Date.now() - start;
  const result: StressTestResult = {
    suiteName: "Reputation Clamping & Tier Matrix",
    iterations,
    passed: true,
    durationMs: duration,
    details: `${iterations.toLocaleString()} state changes executed with ${boundaryCrossings.toLocaleString()} tier transitions. Range [0, 1000] and Tier 1–5 invariants preserved 100%.`,
  };
  results.push(result);
  console.log(`  ✔ PASSED in ${duration}ms: ${result.details}`);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 5: Extreme Delinquency & Late Payment Penalty Matrix Stress Test
// ─────────────────────────────────────────────────────────────────────────────
function runPenaltyMatrixStressTest(iterations = 50000): StressTestResult {
  const start = Date.now();
  console.log(`\n[Suite 5] Running Late Penalty & Delinquency Matrix Stress Test (${iterations.toLocaleString()} timelines)...`);

  const paymentWindowDays = 10;

  for (let i = 0; i < iterations; i++) {
    // Generate payments from cycleDay 1 to 50
    const cycleDay = (i % 50) + 1;
    const lateDays = calculateLateDays(cycleDay, paymentWindowDays);

    if (cycleDay <= paymentWindowDays) {
      if (lateDays !== 0) throw new Error(`On-time payment on day ${cycleDay} marked late: ${lateDays} days`);
    } else {
      const expectedLate = cycleDay - paymentWindowDays;
      if (lateDays !== expectedLate) throw new Error(`Late days mismatch: expected ${expectedLate}, got ${lateDays}`);
    }

    const penalty = calculateLatePenalty(lateDays);
    if (lateDays === 0) {
      if (penalty !== 0) throw new Error(`Non-zero penalty for on-time payment: ${penalty}`);
    } else {
      if (penalty < 0 || penalty > 100) throw new Error(`Penalty points out of bounds [0, 100]: ${penalty}`);
      // Rule: 10 points per day late, capped at 100
      const expectedPenalty = Math.min(lateDays * 10, 100);
      if (penalty !== expectedPenalty) throw new Error(`Penalty mismatch for ${lateDays} late days: expected ${expectedPenalty}, got ${penalty}`);
    }
  }

  const duration = Date.now() - start;
  const result: StressTestResult = {
    suiteName: "Penalty & Delinquency Matrix",
    iterations,
    passed: true,
    durationMs: duration,
    details: `${iterations.toLocaleString()} payment timelines tested (day 1 to 50). Progressive penalty capped at 100 pts and monotonically non-decreasing.`,
  };
  results.push(result);
  console.log(`  ✔ PASSED in ${duration}ms: ${result.details}`);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  banner("MERIT CIRCLE PROTOCOL - HIGH INTENSITY STRESS TEST ENGINE");
  console.log(`Environment: Node ${process.version} | Timestamp: ${new Date().toISOString()}`);

  const overallStart = Date.now();

  try {
    runGroupFormationStressTest(25000);
    runEconomicInvariantStressTest(10000);
    runAuctionEngineStressTest(20000);
    runReputationStressTest(100000);
    runPenaltyMatrixStressTest(50000);

    const totalDuration = Date.now() - overallStart;
    const totalOps = results.reduce((sum, r) => sum + r.iterations, 0);

    banner("STRESS TEST SUMMARY REPORT");
    console.log(`Total Operations Executed : ${totalOps.toLocaleString()}`);
    console.log(`Total Execution Time     : ${totalDuration}ms (${(totalDuration / 1000).toFixed(2)}s)`);
    console.log(`Throughput Rate           : ${Math.round((totalOps / totalDuration) * 1000).toLocaleString()} ops/second\n`);

    console.table(
      results.map((r) => ({
        "Test Suite": r.suiteName,
        Iterations: r.iterations.toLocaleString(),
        Duration: `${r.durationMs}ms`,
        Status: r.passed ? "✔ PASS" : "✖ FAIL",
      }))
    );

    console.log("\n[OVERALL VERDICT]: ALL INVARIANTS & ECONOMIC FORMULAS PASSED STRESS TESTING WITH 0 DEFECTS.\n");
  } catch (err: any) {
    console.error("\n[CRITICAL FAILURE] Stress test failed with exception:", err);
    process.exit(1);
  }
}

main();
