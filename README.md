🚀 Power Connect

A secure, mobile-first professional matchmaking and networking web application deployed live at an NGO conference including global enterprise attendees.

Planned, designed, built, secured, tested, and shipped solo from concept to production in less than 7 days with a $0 budget, serving hundreds of real-world attendees.

<a href="https://power-connect-demo.vercel.app/" target="_blank">See the app with demo profiles here</a> 

To skip auth, use the testing email address: test@test.test
<br />
NOTE: This is a clone of the original repo to view history and process without accessing the actual profiles.
<br>
<br>

📌 Summary & Core Value Prop

Traditional conference networking is a hassle - attendees often miss opportunities to connect with the most relevent people due to chance or time constraints. 
<br />

Power Connect bridges this gap by presenting a comfortable dating-style swiping UX, accessible via Magic Link or OTP, to  discover, filter, and save profiles for later. This way, attendees can browse for potential connections during meetings or after conference hours, and save the profiles they're interested in approaching later or online. 
<br />

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
