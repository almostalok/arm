/* ─────────────────────────────────────────────────────────────────────────
   ARM (Account & Relationship Manager) — In-memory Mock Data Store
   High-performance dataset for instant reactivity and demonstration.
   ───────────────────────────────────────────────────────────────────────── */

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const daysAhead = (n) => new Date(Date.now() + n * 86400000).toISOString();
const today = () => new Date().toISOString();

export const mockUser = {
  id: "u1",
  name: "Alex Carter",
  email: "alex@armcrm.io",
  role: "Sales Director & Founder",
  company: "ARM Technologies",
  avatar: "",
  createdAt: daysAgo(240),
};

/* Each maker returns a FRESH array so the in-memory store can be reset cleanly. */
export const makeLeads = () => [
  lead("l1", "Dribbble Enterprise", "Acme Corp", "New", "High", "Website", 89345, 8),
  lead("l2", "Google Cloud Integration", "Globex Corp", "Qualified", "High", "Referral", 124000, 20),
  lead("l3", "Amazon Web Expansion", "Initech Global", "Proposal", "Medium", "Outbound", 32123, 35),
  lead("l4", "Stripe Billing Connect", "Umbrella Co", "Won", "High", "Partner", 76500, 60),
  lead("l5", "Notion Team Rollout", "Soylent Corp", "New", "Low", "Website", 12400, 4),
  lead("l6", "Figma Design System", "Hooli Tech", "Qualified", "Medium", "Referral", 54000, 14),
  lead("l7", "Linear Integration", "Pied Piper", "Proposal", "High", "Inbound", 98000, 28),
  lead("l8", "Slack Enterprise Grid", "Vehement Media", "Lost", "Low", "Outbound", 21000, 95),
  lead("l9", "Vercel Enterprise Tier", "Massive Dynamic", "Won", "High", "Partner", 143000, 110),
  lead("l10", "Airtable Data Suite", "Wayne Enterprises", "Qualified", "High", "Executive", 67000, 18),
  lead("l11", "Datadog Observability", "Stark Industries", "New", "Medium", "Website", 45000, 2),
  lead("l12", "Snowflake Pipeline", "Cyberdyne Systems", "Proposal", "High", "Partner", 152000, 48),
  lead("l13", "HubSpot CRM Migration", "Tyrell Corporation", "Won", "Medium", "Referral", 88000, 150),
  lead("l14", "Asana Workflow Ops", "Aperture Labs", "Qualified", "Low", "Inbound", 30000, 22),
  lead("l15", "Zoom Rooms Overhaul", "Oscorp Industries", "New", "Medium", "Outbound", 26000, 6),
  lead("l16", "GitLab CI/CD Migration", "LexCorp Global", "Lost", "Low", "Website", 18000, 70),
];

function lead(_id, name, company, status, priority, source, value, ageDays) {
  return {
    _id,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]/g, "")}@${company
      .toLowerCase()
      .replace(/[^a-z]/g, "")}.com`,
    phone: `+1 555 0${100 + parseInt(_id.slice(1), 10)}`,
    company,
    status,
    priority,
    source,
    value,
    notes:
      status === "Won"
        ? "Closed won — annual multi-seat contract executed."
        : "Active deal in high-touch pipeline.",
    tags: ["enterprise", "saas"],
    order: 0,
    leadScore: Math.min(98, 45 + parseInt(_id.slice(1), 10) * 3),
    buyingStage: status === "Won" ? "Customer" : status === "Proposal" ? "Decision Phase" : "Evaluation",
    createdAt: daysAgo(ageDays),
    updatedAt: daysAgo(Math.max(0, Math.floor(ageDays / 4))),
  };
}

export const makeContacts = () => [
  contact("c1", "Olivia Bennett", "VP of Sales & Growth", "Acme Corp", ["decision-maker", "executive"], true),
  contact("c2", "Noah Carter", "Chief Technology Officer", "Globex Corp", ["technical", "champion"], true),
  contact("c3", "Emma Walsh", "Head of Procurement", "Initech Global", ["finance", "procurement"], false),
  contact("c4", "Liam Foster", "Founder & CEO", "Umbrella Co", ["executive", "vip"], true),
  contact("c5", "Ava Mitchell", "Head of Revenue Ops", "Hooli Tech", ["operations"], false),
  contact("c6", "Ethan Brooks", "Staff Product Architect", "Pied Piper", ["champion", "technical"], true),
  contact("c7", "Sophia Reed", "Director of Product Marketing", "Wayne Enterprises", ["influencer"], false),
  contact("c8", "Mason Hayes", "Chief Financial Officer", "Cyberdyne Systems", ["finance", "executive"], false),
  contact("c9", "Isabella Diaz", "VP of Global Growth", "Stark Industries", ["vip", "decision-maker"], true),
  contact("c10", "Lucas Park", "Director of Platform Engineering", "Tyrell Corporation", ["technical"], false),
];

function contact(_id, name, title, company, tags, favorite) {
  return {
    _id,
    name,
    title,
    company,
    email: `${name.split(" ")[0].toLowerCase()}@${company
      .toLowerCase()
      .replace(/[^a-z]/g, "")}.com`,
    phone: `+1 555 0${100 + parseInt(_id.slice(1), 10)}`,
    tags,
    favorite,
    notes: favorite ? "Key executive contact for accounts." : "",
    createdAt: daysAgo(parseInt(_id.slice(1), 10) * 7),
  };
}

const leadLite = (_id, name, company) => ({ _id, name, company });

export const makeNotes = () => [
  note("n1", "Decision timeline scheduled for end of month. Confirmed solutions architecture review with VP Engineering.", leadLite("l2", "Google Cloud Integration", "Globex Corp"), true, 3),
  note("n2", "Pricing alignment review: provided customized ROI breakdown and tiered enterprise volume discounts.", leadLite("l3", "Amazon Web Expansion", "Initech Global"), false, 6),
  note("n3", "Internal champion promoted to VP; established direct introduction with procurement lead.", leadLite("l7", "Linear Integration", "Pied Piper"), true, 9),
  note("n4", "Completed SOC 2 Type II compliance audit packet delivery and vendor security review.", leadLite("l12", "Snowflake Pipeline", "Cyberdyne Systems"), false, 12),
  note("n5", "Completed comprehensive platform demo with 8 stakeholders from the growth engineering team.", leadLite("l1", "Dribbble Enterprise", "Acme Corp"), false, 1),
  note("n6", "Expansion discussion confirmed for Q4 roadmap: multi-region cluster deployment approved.", leadLite("l9", "Vercel Enterprise Tier", "Massive Dynamic"), false, 18),
  note("n7", "Technical deep-dive session scheduled for next Tuesday regarding high-throughput API rate limits.", leadLite("l10", "Airtable Data Suite", "Wayne Enterprises"), false, 5),
  note("n8", "Discovery call completed. Budget cycle opens on 1st of next month; scheduled automated follow-up.", leadLite("l5", "Notion Team Rollout", "Soylent Corp"), false, 2),
];

function note(_id, content, lead, pinned, ageDays) {
  return { _id, content, lead, contact: null, pinned, createdAt: daysAgo(ageDays) };
}

export const makeTasks = () => [
  task("t1", "Deliver executive proposal & pricing model", "High", "Pending", daysAgo(2), leadLite("l3", "Amazon Web Expansion", "Initech Global")),
  task("t2", "Host technical architecture deep-dive with Wayne Enterprises", "Medium", "In Progress", daysAhead(3), leadLite("l10", "Airtable Data Suite", "Wayne Enterprises")),
  task("t3", "Conduct quarterly business review & expansion check-in", "Low", "Pending", daysAhead(7), leadLite("l9", "Vercel Enterprise Tier", "Massive Dynamic")),
  task("t4", "Build tailored enterprise ROI analysis model", "High", "Completed", daysAgo(4), leadLite("l3", "Amazon Web Expansion", "Initech Global")),
  task("t5", "Negotiate master services agreement with legal team", "High", "Pending", today(), leadLite("l12", "Snowflake Pipeline", "Cyberdyne Systems")),
  task("t6", "Send customer case study and benchmark metrics", "Medium", "Pending", daysAhead(1), leadLite("l2", "Google Cloud Integration", "Globex Corp")),
  task("t7", "Review contract redlines & standard SLA commitments", "High", "In Progress", daysAgo(1), leadLite("l7", "Linear Integration", "Pied Piper")),
  task("t8", "Conduct initial discovery & technical qualification call", "Low", "Pending", daysAhead(5), leadLite("l15", "Zoom Rooms Overhaul", "Oscorp Industries")),
  task("t9", "Share SOC 2 Type II trust report and DPA docs", "Medium", "Completed", daysAgo(8), leadLite("l12", "Snowflake Pipeline", "Cyberdyne Systems")),
  task("t10", "Schedule re-engagement touchpoint for upcoming budget cycle", "Low", "Pending", daysAhead(14), leadLite("l5", "Notion Team Rollout", "Soylent Corp")),
];

function task(_id, title, priority, status, dueDate, relatedLead) {
  return {
    _id,
    title,
    description: "",
    dueDate,
    status,
    priority,
    relatedLead,
    relatedContact: null,
    completedAt: status === "Completed" ? daysAgo(1) : null,
    createdAt: daysAgo(parseInt(_id.slice(1), 10) * 2),
  };
}

/* Outreach Email Templates Playbook */
export const outreachTemplates = [
  {
    id: "followup",
    name: "Executive Follow-Up",
    subject: "Following up on our discussion: next steps for {{company}}",
    body: "Hi {{firstName}},\n\nThank you for taking the time to speak earlier this week. It was great learning about your team's goals at {{company}}.\n\nAs discussed, I have put together our proposal and architecture outline tailored to your requirements. Would you and the team have 20 minutes later this week to review the key points and next steps?\n\nBest regards,\nAlex Carter\nARM Relationship Workspace",
  },
  {
    id: "proposal",
    name: "Proposal & Terms Review",
    subject: "ARM Workspace Proposal & Implementation Plan: {{dealName}}",
    body: "Hi {{firstName}},\n\nFollowing our review, please find the comprehensive commercial proposal for {{company}} attached.\n\nKey highlights include:\n- Full access to ARM deal orchestration & workflow automation\n- Dedicated enterprise onboarding & migration assistance\n- Enterprise SLA with 99.99% uptime guarantee\n\nLet me know when is best for a quick walk-through of the terms.\n\nBest regards,\nAlex Carter",
  },
  {
    id: "checkin",
    name: "Quarterly Check-In & Expansion",
    subject: "Checking in on {{company}}'s growth & pipeline performance",
    body: "Hi {{firstName}},\n\nI hope your quarter is off to a stellar start! I wanted to check in and see how the team is finding the platform and whether there are additional workflows we can assist with.\n\nWe recently rolled out several high-velocity pipeline analytics features that might be especially relevant for {{company}}.\n\nWould you be open to a brief catch-up sometime next week?\n\nBest,\nAlex Carter",
  },
  {
    id: "redline",
    name: "Legal & MSA Redlines",
    subject: "MSA & Security Terms for {{company}} Review",
    body: "Hi {{firstName}},\n\nOur legal and compliance team has reviewed the requested redlines and prepared the updated agreement for {{company}}.\n\nAll standard data protection clauses and security terms have been incorporated. Please let us know if everything looks aligned to proceed with execution.\n\nBest,\nAlex Carter",
  },
];

/* Account & Lead Intelligence Scoring */
export const accountIntelligence = {
  healthScore: 88,
  pipelineVelocity: "+24.5% vs last month",
  winRate: "42.8%",
  avgCycleDays: 24,
  keySignals: [
    "High engagement on proposals: average review time under 48 hours",
    "Referral deals converting at 64%, 2.2x faster than cold channels",
    "3 high-value enterprise opportunities approaching decision milestones",
  ],
  riskFactors: [
    "2 proposals in redline review have exceeded standard 14-day SLA",
    "Follow-up cadence overdue on 1 mid-market inbound opportunity",
  ],
  recommendedActions: [
    "Execute closing playbook on Cyberdyne Systems ($152,000)",
    "Schedule technical alignment for Wayne Enterprises ($67,000)",
    "Send automated quarterly check-in to massive accounts",
  ],
};
