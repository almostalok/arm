import React from "react";
import { LeadScoringCard } from "../outreach/LeadScoringCard";

/**
 * Legacy wrapper forwarding to the modern LeadScoringCard.
 */
export function AiInsightsCard(props) {
  return <LeadScoringCard {...props} />;
}
