import React from "react";
import { EmailComposerDialog } from "../outreach/EmailComposerDialog";

/**
 * Legacy wrapper forwarding to the modern EmailComposerDialog.
 */
export function AiEmailDialog(props) {
  return <EmailComposerDialog {...props} />;
}
