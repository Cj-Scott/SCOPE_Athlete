const feedbackLinks = document.querySelectorAll("#feedback-link, [data-feedback-link]");
const copyButtons = document.querySelectorAll("#copy-checklist, [data-copy-checklist]");
const copyStatus = document.querySelector("#copy-status, [data-copy-status]");

const defaultChecklist = [
  "Reviewer context:",
  "Scenario tested: Parent onboarding / School shortlist / Coach follow-up",
  "Did the scenario journey make sense:",
  "What was clear:",
  "What was confusing:",
  "What broke:",
  "Trust or privacy concerns:",
  "Would you recommend this to a parent or player:",
  "Follow-up allowed: Yes / No"
].join("\n");

const workflowChecklists = {
  "parent-onboarding": [
    "Scenario tested: Parent onboarding",
    "Could you understand the first-session journey:",
    "Was the demo data boundary clear:",
    "Could you understand the player profile:",
    "Did the overview feel like a useful summary:",
    "Were settings, backup, and privacy controls easy to find:",
    "Where did the experience first feel confusing or unsafe:",
    "What should be simplified before alpha:"
  ].join("\n"),
  "school-shortlist": [
    "Scenario tested: School shortlist review",
    "Did the recommendation-to-evidence-to-action journey make sense:",
    "Did the recommendation logic feel understandable:",
    "Were fit, evidence, and source confidence clear:",
    "Could you identify missing data or next actions:",
    "Was the pipeline view easy to compare:",
    "What would make school review more trustworthy:"
  ].join("\n"),
  "coach-follow-up": [
    "Scenario tested: Coach follow-up",
    "Did the contact-to-video-to-task journey make sense:",
    "Was Outreach clearly a notes/contact tracker:",
    "Did video link status make sense:",
    "Could you connect outreach, video, and tasks:",
    "Were task statuses understandable:",
    "What should change before alpha:"
  ].join("\n")
};

const workflowKey = document.body.dataset.workflow;
const reviewChecklist = workflowChecklists[workflowKey] ?? defaultChecklist;

feedbackLinks.forEach((feedbackLink) => {
  const inactiveFeedbackLink = feedbackLink.href.includes("REPLACE_WITH") || feedbackLink.href === "#";
  if (inactiveFeedbackLink) {
    feedbackLink.addEventListener("click", (event) => {
      event.preventDefault();
      if (copyStatus) {
        copyStatus.textContent = "Google Form link is not connected yet. Use the checklist button for now.";
      }
    });
  }
});

copyButtons.forEach((copyButton) => {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(reviewChecklist);
      if (copyStatus) {
        copyStatus.textContent = "Review checklist copied.";
      }
    } catch {
      if (copyStatus) {
        copyStatus.textContent = reviewChecklist;
      }
    }
  });
});
