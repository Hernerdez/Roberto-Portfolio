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

/** Terminal: `uptime` counts from here. TODO: set to your RelaDyne start date. */
export const UPTIME_SINCE = "2024-06-01"

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

/** Houston clock: first matching range wins. Hours are 0–23 local (America/Chicago). */
export interface ClockSlot {
  from: number
  to: number // exclusive; ranges may wrap past midnight (from > to)
  activity: string
}
export const CLOCK_SCHEDULE: ClockSlot[] = [
  { from: 23, to: 6, activity: "asleep, unless I'm on call" },
  { from: 6, to: 8, activity: "at the gym" },
  { from: 8, to: 17, activity: "at work keeping the network up" },
  { from: 17, to: 20, activity: "out running" },
  { from: 20, to: 23, activity: "on a side project or in an old Mario title" },
]

export function activityForHour(hour: number): string {
  for (const s of CLOCK_SCHEDULE) {
    const inRange = s.from <= s.to ? hour >= s.from && hour < s.to : hour >= s.from || hour < s.to
    if (inRange) return s.activity
  }
  return "around"
}
