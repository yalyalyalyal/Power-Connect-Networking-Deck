🚀 Power Connect

A secure, mobile-first professional swipe-style networking web application deployed live at an NGO conference including global enterprise attendees.

Planned, designed, built, secured, tested, and shipped solo from concept to production in less than 7 days with a $0 budget, serving hundreds of real-world attendees.

<a href="https://power-connect-demo.vercel.app/" target="_blank">See the app with demo profiles here</a> 

To skip auth, use the testing email address: test@test.test
<br />
NOTE: This is a clone of the original repo to view history and process without accessing the actual profiles.
<br>
<br>


🛠️ The Tech Stack (all free tiers)

Design mockups and assets: Figma 

Prototype and pre-alpha frontend: Lovable

Logic, refactoring, and QA: Claude, Gemini, and hand-coding

Secure Backend: Supabase

Version Control & Deployment: GitHub
<br />

⚡ A Few Engineering & Operational Challenges

1. Zero-Budget or assistance

Challenge: The NGO couldn't spend any money on the project so only completely free tiers could be used.

Solution: Lovable's free tier (24 credits used) and included cloud provided a quick POC/Prototype before migrating to an external Supabase database and updating the project directly on GitHub.


2. Data Pipeline

Challenge: The NGO lacked a structured database of attendees, possessing only raw, unformatted registration logs. Linkedin scraping of profiles via api, especially profile photos, results in a swift ban.

Solution: Personally scraped and cleaned the dataset by hand, and using some scripts and GSheets formulas. Used the NGO's Google Drive to host profile photos (uid as key) with the format: https://lh3.googleusercontent.com/d/[file_id]=s500.


3. High-Pressure Live Triage & Hotfixing

Challenge: Minimal time and capacity for QA meant that minutes after the live production launch, aggressive corporate email firewalls (e.g., Microsoft Safe Links) began pre-scanning and instantly consuming single-use Magic Login links before attendees could physically open them.

Solution: Executed immediate live telemetry diagnostics and shipped an emergency hotfix to production. Implemented a coordinated 6-digit numerical OTP (One-Time Password) to allow users to type fallback security tokens directly into the UI, bypassing firewall link-clipping with zero downtime.


4. Lovable's Fear of Abandonment

Challenge: Lovable is built with retention in mind so the team has included a number of ways to make migrating away from Lovable a mission. It's not as easy as "Claude, migrate to Vercel. Make no mistakes".

Solution: Research, persistence, manual coding. The app is no longer dependent on Lovable and can be migrated to any other deployment environment. 


5. Supabase Email Limitations

Challenge: Thanks to some cases of code injection, Supabase limited the free tier so that it no longer has access to custom email formatting. This broke my OTP backup for the cloned demo version. <a href="https://supabase.com/changelog/46599-changes-to-email-template-customisation-on-free-tier" target="_blank">Details here.</a>

Solution: I migrated the project I initially set up for testing with my dummy account (before creating the NGO's project) to my real account and recreated the demo project tables and policies. 


📊 Live Production Metrics & Product Insights
Data analyzed from live production server telemetry (Supabase_Logs_API-Gateway_Merged.csv, Supabase_Logs_Auth_Merged.csv) over the conference activation window highlights clear user engagement trends and operational efficiency:

🎯 The Networking Funnel (User Psychology)
60.7% Right-Swipe Rate: Out of all live user discovery actions (POST requests), 60.7% resulted in a Bookmark (Right-Swipe / Save) compared to just 39.3% Rejections (Left-Swipe / Skip).

PM Insight: Traditional social matching apps typically see right-swipe rates well under 40%. A 60.7% intentional connection rate proves that conference attendees have exceptionally high networking intent and find immediate utility in discovering nearby profiles rather than being overly selective.

Intense Re-visitation (High Feature Retention): Users fetched their bookmarked lists (GET /bookmarks) 110 times and reviewed skipped profiles (GET /rejections) 80 times. Attendees weren't just swiping and forgetting; they consistently returned to their curated dashboard to review potential real-world connections.

⚡ Infrastructure Performance
97.3% Core API Success Rate: The application layer handled live traffic with 97.3% of all gateway requests returning successful 200, 201, or 204 status codes under highly concurrent conference conditions.

💡 Key Product Learnings
Design Defensively Against Corporate IT Infrastructure: Building for enterprise attendees means anticipating aggressive corporate security. Enterprise firewalls (e.g., Microsoft Safe Links) will "click" and instantly invalidate single-use Magic Login links during background pre-scanning before the user ever sees them. The fallback implementation of a 6-digit numerical OTP was vital to saving user onboarding.

Optimize Auth Rate-Limits Early: Using standard free-tier backends means inheriting default rate limits (e.g., Supabase's standard 3 emails/hour per IP). In a live event environment where hundreds of users attempt to log in simultaneously during an opening keynote, this creates an immediate onboarding bottleneck for users who fail to login on the first attempt (exacerbated by the corporate firewall issue). Shifting to an external custom SMTP provider is a day-one prerequisite for live activations.

High Intent Negates the Need for Complex Matching Algorithms: In a localized, high-stakes networking environment (like a niche NGO summit), simple, transparent filtering paired with a fast discovery UX outperforms complex AI matchmaking algorithms. Users prioritize comprehensive visibility and speed of saving over automated curation.
