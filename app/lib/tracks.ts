// Shared by the signup form, the admin dashboard and the admin training page.

export const TRACKS = [
  "Social Media Posting",
  "AI Content Creation",
  "Canva Design",
  "Gallery & Image Updates",
  "Post Scheduling",
  "Media & Creative",
  "Community Mobilization",
  "Research & Writing",
  "Translation",
  "Event Support",
];

// The HubSpot "Volunteer Track" dropdown only accepts its original five values,
// so new tracks are sent to HubSpot as the closest one. Our own database keeps the real track.
export const HUBSPOT_TRACK: Record<string, string> = {
  "Social Media Posting": "Media & Creative",
  "AI Content Creation": "Research & Writing",
  "Canva Design": "Media & Creative",
  "Gallery & Image Updates": "Media & Creative",
  "Post Scheduling": "Event Support",
};

export type TaskTemplate = {
  key: string; job: string; track: string; mins: string;
  title: string; details: string; who: string; prompt: string;
};

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    key: "status", job: "WhatsApp Status posting", track: "Social Media Posting", mins: "10 min / day",
    title: "Post the Greenforce flyers on your WhatsApp Status",
    details: "Download the flyers shared in the group and post one on your WhatsApp Status each day this week. Screenshot each posted Status and send the screenshots in the Active Volunteers group.",
    who: "Only volunteers who are happy to post on their Status.",
    prompt: "(No AI needed. Just share the flyers in the group.)",
  },
  {
    key: "quotes", job: "AI quote content refresh", track: "AI Content Creation", mins: "45 min",
    title: "Refresh this week's quote content with AI",
    details: "Use an AI tool (ChatGPT, Claude or Gemini) with the prompt from the coordinator to create 10 fresh quotes about farming, hope, education and community. Check each for accuracy and tone, then paste them into the shared quotes document.",
    who: "Anyone comfortable using an AI assistant.",
    prompt: "Give me 10 original, uplifting quotes (max 25 words) on farming, hope, education and community service, suitable for an African NGO audience. No clichés, no attribution to real people.",
  },
  {
    key: "posts50", job: "Create 50 post captions", track: "AI Content Creation", mins: "1.5 hrs",
    title: "Create 50 social media post captions with AI",
    details: "Use AI to write 50 captions across 5 themes (greenhouses, education, healthcare outreach, widow & elder care, volunteering). Keep each under 60 words with a hook and a call to action. Put them in the shared sheet, one per row.",
    who: "A detail-minded volunteer; split into 2 people of 25 for speed.",
    prompt: "Write 50 social media captions for VTO Greenforce Foundation Africa. 10 each on: school greenhouses, education sponsorships, healthcare outreach, widow and elder care, volunteering. Under 60 words, strong first line, clear call to action, 2 hashtags.",
  },
  {
    key: "template", job: "Update a template with our quotes", track: "Canva Design", mins: "30 min",
    title: "Update the quote template with this week's quotes",
    details: "Open the shared template, replace the quote text with the quotes the coordinator provides (one design per quote), keep fonts and colours unchanged, and export as PNG. Upload the files to the shared folder.",
    who: "Anyone who can follow a template; no design skill needed.",
    prompt: "(No AI needed. Give them the quotes and the template link.)",
  },
  {
    key: "canva", job: "Design a new template in Canva Pro", track: "Canva Design", mins: "1.5 hrs",
    title: "Design one new post template in Canva",
    details: "You've been invited to our Canva Pro team. Design one clean template (1080x1080) using the Greenforce green, cream and gold colours and our logo. Share the design link in the group when finished.",
    who: "A volunteer with design interest. Invite them to Canva Pro first.",
    prompt: "Suggest 5 layout ideas for a 1080x1080 social post template for an African agriculture NGO using deep green, cream and gold. Describe each in two lines.",
  },
  {
    key: "gallery", job: "Gallery image updates", track: "Gallery & Image Updates", mins: "30 min",
    title: "Upload this week's 10 photos to the website gallery",
    details: "Log in to the gallery page with the login the coordinator gave you. Upload each photo with a clear caption and the right category. Do not delete anything unless told to.",
    who: "A trusted volunteer who has been given the gallery login (see Settings).",
    prompt: "Write a clear 8-word caption for each of these photo descriptions: (paste descriptions).",
  },
  {
    key: "facebook", job: "Draft Facebook posts", track: "Social Media Posting", mins: "1 hr",
    title: "Draft 5 Facebook posts for next week",
    details: "Write 5 Facebook posts (80-120 words each) using the approved topics list. Use AI for a first draft, then edit in your own warm voice. Add a suggested image idea under each. Submit in the shared document.",
    who: "Volunteers with a Social Media or Media track.",
    prompt: "Write 5 Facebook posts of 80-120 words for VTO Greenforce Foundation Africa on these topics: (paste topics). Conversational, hopeful, one clear call to action each. Add a suggested image idea after each.",
  },
  {
    key: "schedule", job: "Schedule the week's posts", track: "Post Scheduling", mins: "45 min",
    title: "Schedule next week's approved posts",
    details: "Take the approved captions and images from the shared folder and schedule them in the scheduling tool (best times: 8am, 12pm, 6pm). Send a screenshot of the finished schedule in the group.",
    who: "A reliable volunteer. Give access to the scheduling tool first.",
    prompt: "Suggest an optimal weekly posting schedule (days and times) for a Ghana-based NGO on Facebook and WhatsApp Status, for 5 posts per week.",
  },
];
