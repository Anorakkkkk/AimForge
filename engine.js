// =============================
// AimForge Engine 2.0 Core
// =============================

export function calculateSkillProfile(player) {
    const aimScore = calculateAim(player);
    const impactScore = calculateImpact(player);
    const consistencyScore = calculateConsistency(player);

    const gsi =
        (aimScore * 0.35) +
        (impactScore * 0.4) +
        (consistencyScore * 0.25);

    return {
        aimScore: round(aimScore),
        impactScore: round(impactScore),
        consistencyScore: round(consistencyScore),
        gsi: round(gsi)
    };
}

// -----------------------------
// AIM DIMENSION
// -----------------------------
function calculateAim(p) {
    const hsWeight = normalize(p.headshot, 5, 35);
    const kdWeight = normalize(p.kd, 0.5, 1.5);
    return (hsWeight * 0.6) + (kdWeight * 0.4);
}

// -----------------------------
// IMPACT DIMENSION
// -----------------------------
function calculateImpact(p) {
    const adrWeight = normalize(p.adr, 80, 180);
    const winWeight = normalize(p.winrate, 40, 65);
    return (adrWeight * 0.7) + (winWeight * 0.3);
}

// -----------------------------
// CONSISTENCY DIMENSION
// -----------------------------
function calculateConsistency(p) {
    return normalize(p.consistency, 0, 100);
}

// -----------------------------
// Helpers
// -----------------------------
function normalize(value, min, max) {
    if (value <= min) return 0;
    if (value >= max) return 100;
    return ((value - min) / (max - min)) * 100;
}

function round(num) {
    return Math.round(num * 100) / 100;
}
// =============================
// Rank Projection System
// =============================

export function projectRank(player, profile) {

    const growthRate = estimateGrowth(player);
    const targetGSI = getNextRankThreshold(profile.gsi);

    const daysToRank = estimateDays(profile.gsi, targetGSI, growthRate);

    return {
        nextRankTarget: targetGSI,
        estimatedDays: daysToRank,
        growthRate: round(growthRate)
    };
}

function estimateGrowth(p) {
    // Simplified growth formula
    const disciplineFactor = normalize(p.consistency, 0, 100);
    const trainingFactor = normalize(p.headshot, 5, 30);

    return (disciplineFactor * 0.6) + (trainingFactor * 0.4);
}

function getNextRankThreshold(currentGSI) {
    const ranks = [600, 750, 900, 1050, 1200];
    for (let r of ranks) {
        if (currentGSI < r) return r;
    }
    return 1400;
}

function estimateDays(current, target, growth) {
    if (growth <= 0) return null;

    const gap = target - current;
    const progressPerDay = growth * 0.5;

    return Math.ceil(gap / progressPerDay);
}
