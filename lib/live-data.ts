/* Static content behind the live widgets, the hero typewriter and the
 * terminal-style About. Edit here, not in the components. */

export const CONTACT_EMAIL = "contact@hernerdez.com"
export const SOCIALS = {
  github: "https://github.com/hernerdez",
  linkedin: "https://www.linkedin.com/in/roberto-hernandez-151537295/",
  instagram: "https://www.instagram.com/hernerdez",
}

/** Hero: phrases the subtitle cycles through after the h2 finishes typing. */
export const HERO_PHRASES = [
  "Network Engineer · CCNA",
  "automating Meraki with Python",
  "running a 3-node Proxmox cluster",
  "probably out running",
]

/** Terminal: `uptime` counts from here (RelaDyne start date). */
export const UPTIME_SINCE = "2025-08-18"

/** Terminal: `cat about.txt` */
export const ABOUT_TXT = [
  "Roberto Hernandez — Network Engineer & Software Developer, Houston TX.",
  "",
  "IT & networking at RelaDyne: ~2,000 users, HQ + branch sites nationwide.",
  "Own the Cisco Meraki + UniFi environments and the Cisco Nexus core at HQ.",
  "Palo Alto firewall changes through Panorama. Solo branch buildouts,",
  "rack to first login. 24/7 on-call rotation.",
  "Also: Intune / Entra ID, Genetec + HID access control, CUCM → Teams Phone.",
  "",
  "B.S. Software Engineering, Sam Houston State (May 2025). CCNA (Nov 2026).",
  "Bilingual English / Spanish.",
  "",
  "Off the clock: classic Nintendo (DS / Wii / Wii U era), basketball, side projects.",
]

/** Houston clock fallback. The live answer comes from the "Now" calendar via
 *  /api/now when SCHEDULE_ICS_URL is set; this table only fills the gaps.
 *  Hours are 0–23 Houston time; a range may wrap past midnight (from > to).
 *  Weekday keys: 0 = Sunday … 6 = Saturday; "default" covers the rest. */
export interface ClockSlot {
  from: number
  to: number
  activity: string
}
export const CLOCK_SCHEDULE: { default: ClockSlot[] } & Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, ClockSlot[]>> = {
  default: [
    { from: 22, to: 5, activity: "asleep, unless I'm on call" },
    { from: 5, to: 7, activity: "training before work" },
    { from: 7, to: 8, activity: "eating breakfast and driving in" },
    { from: 8, to: 12, activity: "at work keeping the network up" },
    { from: 12, to: 13, activity: "eating lunch, on schedule" },
    { from: 13, to: 17, activity: "at work keeping the network up" },
    { from: 17, to: 18, activity: "driving home" },
    { from: 18, to: 19, activity: "eating dinner" },
    { from: 19, to: 22, activity: "on a side project or in an old Mario title" },
  ],
  6: [
    { from: 23, to: 7, activity: "asleep" },
    { from: 7, to: 9, activity: "training" },
    { from: 9, to: 12, activity: "in the homelab" },
    { from: 12, to: 18, activity: "out, probably playing basketball" },
    { from: 18, to: 23, activity: "on a side project" },
  ],
  0: [
    { from: 23, to: 8, activity: "asleep" },
    { from: 8, to: 12, activity: "meal prepping for the week" },
    { from: 12, to: 18, activity: "out, probably playing basketball" },
    { from: 18, to: 23, activity: "getting ready for the week" },
  ],
}

export function activityForHour(hour: number, weekday?: number): string {
  const table = (weekday !== undefined && CLOCK_SCHEDULE[weekday as 0 | 1 | 2 | 3 | 4 | 5 | 6]) || CLOCK_SCHEDULE.default
  for (const s of table) {
    const inRange = s.from <= s.to ? hour >= s.from && hour < s.to : hour >= s.from || hour < s.to
    if (inRange) return s.activity
  }
  return "around"
}
