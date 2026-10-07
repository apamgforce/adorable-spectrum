# Greenforce website and volunteer system

The public website for VTO Greenforce Foundation Africa, plus the tools the team uses to run volunteers: applications, approvals, weekly tasks, proof of work, badges and certificates.

Day-to-day use is explained inside the dashboard (press **How to use this** at the top of the admin page) and in [docs/COORDINATOR-HANDBOOK.md](docs/COORDINATOR-HANDBOOK.md). This file is for whoever looks after the website itself.

## The pages

| Page | Who uses it |
|---|---|
| `/volunteer` | Anyone applying to volunteer |
| `/volunteer/training` | New volunteers (about 20 minutes) |
| `/volunteer/portal` | Volunteers, to see and finish their tasks with their ID |
| `/admin` | Greenforce Admin (owner): everything, including Settings, logins, HubSpot and deleting volunteers |
| `/coordinator` | The volunteer coordinator: approve, edit, assign, verify, certificates, news. No Settings or deleting |
| `/coordinator/training` | The coordinator's guide |
| `/gallery-admin` | Whoever updates website photos |
| `/insights` | Website traffic numbers |

## Settings on Vercel

Vercel → the project → Settings → Environment Variables. After changing anything here, go to Deployments and press **Redeploy** on the latest one.

| Name | What to put | Needed? |
|---|---|---|
| `POSTGRES_URL` | Database connection (added automatically when the Neon database was connected) | Yes |
| `BLOB_READ_WRITE_TOKEN` | File storage for uploads (added automatically when Blob storage was connected) | Yes |
| `ADMIN_SECURE_TOKEN` | The admin login written as `username:password`, e.g. `greenforce:SomeLongPassword2026` | Yes |
| `INSIGHTS_SECURE_TOKEN` | A separate `username:password` that only opens `/insights` | Optional |
| `HUBSPOT_ACCESS_TOKEN` | Lets the site write volunteer details straight into HubSpot (see below) | Strongly recommended |

### Changing passwords

`ADMIN_SECURE_TOKEN` (and `INSIGHTS_SECURE_TOKEN`, if used) are the **starting** logins. The coordinator has no variable: the owner creates that login in **Settings → Dashboard logins**. After that, nobody needs Vercel:

- **Anyone** (owner or coordinator): press **Password** at the top of the dashboard.
- **The owner** can set or reset the coordinator's and the Insights login in **Settings → Dashboard logins**.

Once a login has been changed on the site, the site password is the one that works and the old Vercel value stops working. If anyone is ever locked out, edit that variable in Vercel and redeploy: the Vercel value then works again, and the person can set a new password from the dashboard. Passwords are stored hashed in the database.

## HubSpot

Every application is saved on the site first, so nothing is lost if HubSpot is down. It is then sent to HubSpot in two ways:

1. **The HubSpot volunteer form.** This always happens and keeps anything that runs from form submissions working (such as the Make confirmation email). HubSpot only keeps fields that exist on that form, which is why WhatsApp numbers were going missing: the form has no phone field.
2. **Direct update (when `HUBSPOT_ACCESS_TOKEN` is set).** The contact is created or updated with name, email, WhatsApp number (in *Mobile Phone Number* and *Phone Number*), track, hours and mode. Edits made in the admin are sent the same way.

### Connect HubSpot (about 5 minutes)

1. In HubSpot, open Settings (gear icon) → Integrations → **Private Apps**. In newer accounts this sits under Development → **Legacy apps** → Create → Private.
2. Name it `Greenforce website`. Under Scopes, tick `crm.objects.contacts.read` and `crm.objects.contacts.write`. Create it and copy the access token.
3. In Vercel, add `HUBSPOT_ACCESS_TOKEN` with that token and redeploy.
4. Open the admin → Settings → **Send missing details to HubSpot**. Press it again until it says HubSpot is up to date.

### Also worth doing in HubSpot

Add the **Mobile phone number** field to the volunteer form (Marketing → Forms → open the form → drag the field in → Update). Then the form itself carries the number too, and HubSpot's own form reports show it.

Hours: the site offers "7-8 hours", which HubSpot stores as its existing "7-14 hours" option. No change is needed.

## Volunteers who applied before this update

Their hours and engagement mode were only saved in HubSpot. When you next open one of them in the admin, copy those two answers from HubSpot into their details and save.

## Making changes to the code

```bash
npm install
npm run dev     # http://localhost:3000, needs the same environment variables in a .env.local file
npm run build   # check that everything compiles before pushing
```

Pushing to the `main` branch on GitHub deploys automatically. The database tables create and update themselves on first use, so there are no migrations to run.

Track names, hours and engagement options live in `app/lib/tracks.ts`. The form, admin and HubSpot sync all read from there, so add or rename options in that one place. A new track that HubSpot's *Volunteer Track* dropdown doesn't have must also be added to `HUBSPOT_TRACK` in the same file (mapped to the closest existing option), or added as an option in HubSpot.
