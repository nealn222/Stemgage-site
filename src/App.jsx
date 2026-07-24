import { useState, useEffect, useRef, useCallback } from "react";
import {
  Building2, Egg, Orbit, Ship, Waypoints, Sparkles, ArrowRight, MapPin,
  Clock, CalendarDays, Mail, Phone, Instagram, Facebook, Menu, X, Search,
  Heart, Users, GraduationCap, Lightbulb, Hammer, Rocket, Quote, Star,
  CheckCircle2, ChevronLeft, ChevronRight, BookOpen, HandHeart
} from "lucide-react";
import spaghettiTowerImg from "./images/IMG_2659.jpeg";

/* ----------------------------------------------------------------------------
   STEMgage — hands-on STEM for elementary kids, at the library, free.
   Single-file React site. Brand color via CSS vars + inline style; Tailwind
   handles layout/spacing/responsive. No external images (placeholders are
   designed "build-spec" tiles so nothing ever shows up broken).
---------------------------------------------------------------------------- */

const C = {
  ink: "#112250", blueprint: "#0B1F4D", cobalt: "#2B6BEF", cobaltDeep: "#1A4FD0",
  sky: "#E8F0FF", sunny: "#FFC233", sunnyDeep: "#F4A800", sprout: "#2FBF71",
  coral: "#FF7A59", cloud: "#FFFFFF", paper: "#F6F9FF",
};

const challenges = [
  { key: "tower",  name: "Spaghetti Tower", image: spaghettiTowerImg, g1: C.cobalt, g2: C.sprout,
    tagline: "Build a tower out of spaghetti. Yes, really.",
    blurb: "Tallest free-standing tower from dry pasta and a little tape wins. Easy to start, surprisingly hard to top."
  { key: "egg",    name: "Egg Drop", icon: Egg, g1: C.sunny, g2: C.coral,
    tagline: "Drop an egg. Keep it whole. Win.",
    blurb: "Design a landing pad that protects a raw egg from a serious fall. One crack and it's back to the drawing board." },
  { key: "marble", name: "Marble Run", icon: Orbit, g1: C.cobalt, g2: C.coral,
    tagline: "Send a marble on the ride of its life.",
    blurb: "Cut, fold, and angle paper tracks to keep a marble rolling the longest without flying off." },
  { key: "boat",   name: "Foil Boat", icon: Ship, g1: C.sprout, g2: C.cobalt,
    tagline: "Float a boat made of foil.",
    blurb: "Shape a sheet of aluminum foil into a boat that holds the most weight before it sinks." },
  { key: "bridge", name: "Paper Bridge", icon: Waypoints, g1: C.sunny, g2: C.sprout,
    tagline: "Build a bridge from paper that actually holds.",
    blurb: "Span a gap with nothing but paper and creativity, then load it up and see what it can carry." },
];

const events = [
  { title: "Spaghetti Tower Challenge", branch: "Wellington Library", date: "Sat, Jul 12, 2026", time: "2:00 – 3:30 PM",
    icon: Building2, g1: C.cobalt, g2: C.sprout, desc: "Kick off the summer building the tallest pasta tower in Palm Beach County." },
  { title: "Egg Drop Engineering", branch: "Boca Raton Library, Downtown", date: "Sat, Jul 26, 2026", time: "2:00 – 3:30 PM",
    icon: Egg, g1: C.sunny, g2: C.coral, desc: "Design a landing pad, drop the egg, and find out if your plan holds up." },
  { title: "Marble Run Mania", branch: "Parkland Library", date: "Sat, Aug 9, 2026", time: "10:30 AM – 12:00 PM",
    icon: Orbit, g1: C.cobalt, g2: C.coral, desc: "Angles, ramps, and gravity. Keep your marble rolling the longest." },
  { title: "Foil Boat Float-Off", branch: "Wellington Library", date: "Sat, Aug 23, 2026", time: "2:00 – 3:30 PM",
    icon: Ship, g1: C.sprout, g2: C.cobalt, desc: "Shape a foil boat that carries the most weight before it goes under." },
  { title: "Paper Bridge Build", branch: "Boca Raton Library, Spanish River", date: "Sat, Sep 6, 2026", time: "2:00 – 3:30 PM",
    icon: Waypoints, g1: C.sunny, g2: C.sprout, desc: "Span the gap with paper, then load it up and test your design." },
  { title: "Mystery Build Day", branch: "Parkland Library", date: "Sat, Sep 20, 2026", time: "10:30 AM – 12:00 PM",
    icon: Sparkles, g1: C.coral, g2: C.cobalt, desc: "Surprise challenge, mystery materials. Show up and find out." },
];

const team = {
  founders: [
    { name: "Ishaan Gupta", role: "Co-Founder" },
    { name: "Nikhil Venigalla", role: "Co-Founder" },
    { name: "Neal Nayak", role: "Co-Founder" },
  ],
  volunteers: [
    { name: "Neel Bharambe", role: "Volunteer" },
    { name: "Reyhaan Thummadi", role: "Volunteer" },
    { name: "Abhi Yalamanchili", role: "Volunteer" },
    { name: "Maya Iyer", role: "Volunteer" },
    { name: "Panav Patel", role: "Volunteer" },
    { name: "Micah Wang", role: "Volunteer" },
  ],
};

const initials = (n) => n.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();

/* ---------- tiny building blocks ---------- */

function Eyebrow({ children, color = C.cobalt }) {
  return <div className="sg-eyebrow" style={{ color }}>{children}</div>;
}

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`sg-reveal ${seen ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Button({ children, variant = "solid", onClick, full, as = "button", href }) {
  const base = "sg-btn " + (variant === "solid" ? "sg-btn-solid" : variant === "ghost" ? "sg-btn-ghost" : "sg-btn-yellow");
  const cls = `${base} ${full ? "w-full" : ""}`;
  if (as === "a") return <a href={href} className={cls} onClick={onClick}>{children}</a>;
  return <button type="button" className={cls} onClick={onClick}>{children}</button>;
}

/* A designed photo placeholder shaped like a build-spec sheet */
function BuildTile({ icon: Icon, label, g1, g2, tall }) {
  return (
    <div className="sg-tile" style={{ minHeight: tall ? 280 : 200 }}>
      <div className="sg-tile-art" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
        <div className="sg-grid-overlay" aria-hidden="true" />
        <Icon size={tall ? 72 : 56} color="#ffffff" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <div className="sg-tile-meta">
        <span className="sg-mono-label" style={{ color: C.cobalt }}>PHOTO</span>
        <span style={{ color: C.ink, fontWeight: 700 }}>{label}</span>
      </div>
    </div>
  );
}

function StatBadge({ value, label, color }) {
  return (
    <div className="sg-stat">
      <div className="sg-stat-value" style={{ color }}>{value}</div>
      <div className="sg-stat-label">{label}</div>
    </div>
  );
}

/* ---------- hero carousel ---------- */

function Hero({ go }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = challenges.length;
  const next = useCallback(() => setI((v) => (v + 1) % n), [n]);
  const prev = () => setI((v) => (v - 1 + n) % n);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <section className="sg-hero" aria-label="Welcome to STEMgage">
      <span className="sg-blob sg-blob-1" aria-hidden="true" />
      <span className="sg-blob sg-blob-2" aria-hidden="true" />
      <div className="sg-grid-overlay sg-hero-grid" aria-hidden="true" />

      <div className="sg-container sg-hero-inner">
        <div className="sg-hero-copy">
          <div className="sg-badge">
            <CheckCircle2 size={16} aria-hidden="true" />
            No registration. Just show up.
          </div>
          <h1 className="sg-h1">
            Building tomorrow's problem solvers{" "}
            <span className="text-4xl text-blue-500 font-bold sg-underline">one step at a time.</span>
          </h1>
          <p className="sg-lead">
            Free engineering challenges at your local library where elementary students build, test, and create through exciting hands-on STEM experiences. Every event starts with a short lesson followed by a fun engineering challenge that brings science and math to life.
          </p>
          <div className="sg-hero-ctas">
            <Button onClick={() => go("events")}>Find an event near you <ArrowRight size={18} /></Button>
            <Button variant="yellow" onClick={() => go("contact")}>Bring STEMgage to your community</Button>
          </div>
          <div
            className="sg-rotator"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-live="polite"
          >
            <Sparkles size={18} color={C.sunnyDeep} aria-hidden="true" />
            <span key={i} className="sg-rotator-text">{challenges[i].tagline}</span>
          </div>
        </div>

        <div
          className="sg-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="sg-carousel-frame">
            {challenges.map((ch, idx) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.key}
                  className={`sg-slide ${idx === i ? "is-active" : ""}`}
                  style={{ background: `linear-gradient(140deg, ${ch.g1}, ${ch.g2})` }}
                  aria-hidden={idx !== i}
                >
                  <div className="sg-grid-overlay" aria-hidden="true" />
                  {ch.image ? (
  <img
    src={ch.image}
    alt={ch.name}
    style={{
      width: "180px",
      height: "180px",
      objectFit: "cover",
      borderRadius: "16px"
    }}
  />
) : (
  <Icon
    size={120}
    color="#ffffff"
    strokeWidth={1.4}
    aria-hidden="true"
  />
)}
                  <div className="sg-slide-cap">
                    <span className="sg-mono-label" style={{ color: "rgba(255,255,255,.85)" }}>CHALLENGE</span>
                    <strong>{ch.name}</strong>
                  </div>
                </div>
              );
            })}

            <button className="sg-arrow sg-arrow-l" onClick={prev} aria-label="Previous challenge">
              <ChevronLeft size={20} />
            </button>
            <button className="sg-arrow sg-arrow-r" onClick={next} aria-label="Next challenge">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="sg-dots" role="tablist" aria-label="Choose a challenge">
            {challenges.map((ch, idx) => (
              <button
                key={ch.key}
                className={`sg-dot ${idx === i ? "is-active" : ""}`}
                onClick={() => setI(idx)}
                aria-label={`Show ${ch.name}`}
                aria-selected={idx === i}
                role="tab"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- event card ---------- */

function EventCard({ ev, compact }) {
  const Icon = ev.icon;
  return (
    <article className={`sg-event ${compact ? "sg-event-compact" : ""}`}>
      <div className="sg-event-art" style={{ background: `linear-gradient(135deg, ${ev.g1}, ${ev.g2})` }}>
        <div className="sg-grid-overlay" aria-hidden="true" />
        <Icon size={40} color="#fff" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <div className="sg-event-body">
        <span className="sg-pill">Free · No sign-up</span>
        <h3>{ev.title}</h3>
        <p className="sg-event-desc">{ev.desc}</p>
        <ul className="sg-event-meta">
          <li><MapPin size={15} aria-hidden="true" /> {ev.branch}</li>
          <li><CalendarDays size={15} aria-hidden="true" /> {ev.date}</li>
          <li><Clock size={15} aria-hidden="true" /> {ev.time}</li>
        </ul>
      </div>
    </article>
  );
}

/* ---------- pages ---------- */

function Home({ go }) {
  const steps = [
    { icon: HandHeart, t: "Walk in", d: "Show up at the library. No registration, no fee, no special supplies needed." },
    { icon: BookOpen, t: "Quick lesson", d: "A short, friendly intro to the science behind today's challenge." },
    { icon: Hammer, t: "Timed build", d: "Race the clock to design, build, and test your creation." },
    { icon: Rocket, t: "Take the win home", d: "Kids leave with a finished build, new skills, and a reason to love STEM." },
  ];
  return (
    <>
      <Hero go={go} />

      {/* stats */}
      <section className="sg-section sg-stats-band">
        <div className="sg-container sg-stats">
          <StatBadge value="100+" label="kids served so far" color={C.cobalt} />
          <StatBadge value="$0" label="cost to every family" color={C.sprout} />
          <StatBadge value="7" label="signature build challenges" color={C.sunnyDeep} />
          <StatBadge value="2025" label="founded, and just getting started" color={C.coral} />
        </div>
      </section>

      {/* mission */}
      <section className="sg-section">
        <div className="sg-container sg-mission">
          <Reveal>
            <Eyebrow>OUR MISSION</Eyebrow>
            <h2 className="sg-h2">We close the gap between the classroom and the real world.</h2>
            <p className="sg-body">
              In 2025, we founded STEMgage after noticing that many students were learning STEM by memorizing formulas and facts instead of exploring ideas. We created free, hands-on engineering challenges that let kids build, test, and experiment, helping them discover that science and engineering are meant to be experienced, not just studied.
            </p>
            <div className="sg-hero-ctas">
              <Button onClick={() => go("about")} variant="ghost">Read our story <ArrowRight size={18} /></Button>
              <Button onClick={() => go("impact")} variant="ghost">See the impact <ArrowRight size={18} /></Button>
            </div>
          </Reveal>
          <Reveal delay={120} className="sg-mission-art">
            <BuildTile icon={Lightbulb} label="Kids at the build table" g1={C.cobalt} g2={C.sprout} tall />
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section className="sg-section sg-paper">
        <div className="sg-container">
          <Reveal><Eyebrow>HOW A STEMGAGE EVENT WORKS</Eyebrow>
            <h2 className="sg-h2">Four steps, about ninety minutes, a whole lot of fun.</h2>
          </Reveal>
          <div className="sg-steps">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.t} delay={idx * 90}>
                  <div className="sg-step">
                    <span className="sg-step-num">{`0${idx + 1}`}</span>
                    <span className="sg-step-icon"><Icon size={24} color={C.cobalt} aria-hidden="true" /></span>
                    <h3>{s.t}</h3>
                    <p>{s.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* upcoming events preview */}
      <section className="sg-section">
        <div className="sg-container">
          <Reveal>
            <div className="sg-row-between">
              <div>
                <Eyebrow color={C.sprout}>UPCOMING EVENTS</Eyebrow>
                <h2 className="sg-h2">Bring your kid to the next one.</h2>
              </div>
              <Button variant="ghost" onClick={() => go("events")}>All events <ArrowRight size={18} /></Button>
            </div>
          </Reveal>
          <div className="sg-hscroll" role="list">
            {events.slice(0, 4).map((ev) => (
              <div role="listitem" key={ev.title} className="sg-hscroll-item"><EventCard ev={ev} compact /></div>
            ))}
          </div>
          <p className="sg-note"><CheckCircle2 size={16} color={C.sprout} aria-hidden="true" /> Library events do not require registration. Just show up.</p>
        </div>
      </section>

      {/* host band */}
      <section className="sg-section">
        <div className="sg-container">
          <Reveal>
            <div className="sg-cta-band">
              <div className="sg-grid-overlay" aria-hidden="true" />
              <div className="sg-cta-band-inner">
                <Building2 size={40} color="#fff" aria-hidden="true" />
                <div>
                  <h2 className="sg-cta-title">Run STEMgage at your library or club</h2>
                  <p>We bring the lesson, the materials, and the energy. You bring the room and the kids.
                    We are actively partnering with libraries and Boys &amp; Girls Clubs across Palm Beach County.</p>
                </div>
                <Button variant="yellow" onClick={() => go("contact")}>Host an event</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <div className="sg-section sg-pagetop">
      <div className="sg-container sg-prose">
        <Reveal>
          <Eyebrow>ABOUT US</Eyebrow>
          <h1 className="sg-h2 sg-h2-lg">STEM you can build with your hands.</h1>
          <p className="sg-body">
            STEMgage runs free, hands-on engineering events for elementary school students. A participant
            gets a short lesson, then jumps into a timed build challenge. We do it in person, at libraries,
            where any family can simply walk in.
          </p>
        </Reveal>

        <Reveal delay={80} className="sg-card-soft">
          <h2 className="sg-h3">Why we started</h2>
          <p className="sg-body">
            We founded STEMgage in August 2025 after noticing a pattern. In a lot of schools, STEM means
            memorizing facts and filling out worksheets, not actually experimenting. Theory rarely meets
            the real world.
          </p>
          <p className="sg-body">
            That gap hits some kids harder than others. Kinesthetic learners, the ones who understand by
            doing, get left behind by pen-and-paper teaching. And students in underserved communities often
            have the fewest resources for hands-on learning in the first place. We wanted to change that with
            something simple and free.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="sg-h3">Where we are headed</h2>
          <p className="sg-body">
            We have already served more than 70 elementary students at the Wellington Library branch. Now we
            are expanding across Palm Beach County, with events coming to Boca Raton libraries, Parkland
            libraries, and the Boys &amp; Girls Clubs of Palm Beach County. Our goal is to reach the
            communities that need hands-on STEM the most.
          </p>
          <div className="sg-chip-row">
            {["Wellington", "Boca Raton", "Parkland", "Boys & Girls Clubs"].map((p) => (
              <span key={p} className="sg-chip"><MapPin size={14} aria-hidden="true" /> {p}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Impact() {
  const [q, setQ] = useState("");
  const filtered = challenges.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  const moments = [
    { label: "First tower over two feet tall", icon: Building2, g1: C.cobalt, g2: C.sprout },
    { label: "Zero eggs cracked, one happy team", icon: Egg, g1: C.sunny, g2: C.coral },
    { label: "A foil boat that held 40 coins", icon: Ship, g1: C.sprout, g2: C.cobalt },
  ];
  return (
    <div className="sg-section sg-pagetop">
      <div className="sg-container">
        <Reveal>
          <Eyebrow color={C.coral}>IMPACT</Eyebrow>
          <h1 className="sg-h2 sg-h2-lg">What 70+ kids have already built.</h1>
          <p className="sg-body sg-measure">
            Every event ends with finished projects, big grins, and a few parents asking when the next one
            is. Here is a look at the challenges we run. Real event photos and videos will live here.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <div className="sg-search">
            <Search size={18} color={C.cobalt} aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter challenges, try egg or boat"
              aria-label="Filter the gallery by challenge"
            />
          </div>
        </Reveal>

        <div className="sg-gallery">
          {filtered.map((c, idx) => (
            <Reveal key={c.key} delay={idx * 70}>
              <div className="sg-gallery-card">
                <BuildTile icon={c.icon} label={c.name} g1={c.g1} g2={c.g2} tall />
                <p className="sg-gallery-blurb">{c.blurb}</p>
              </div>
            </Reveal>
          ))}
          {filtered.length === 0 && (
            <p className="sg-empty">No challenges match that yet. Try clearing the filter.</p>
          )}
        </div>

        <Reveal>
          <h2 className="sg-h3 sg-mt">Featured moments</h2>
          <div className="sg-moments">
            {moments.map((m) => (
              <div className="sg-moment" key={m.label}>
                <BuildTile icon={m.icon} label={m.label} g1={m.g1} g2={m.g2} />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="sg-press">
            <Quote size={28} color={C.cobalt} aria-hidden="true" />
            <h2 className="sg-h3">In the news</h2>
            <p className="sg-body">
              Press and community mentions will appear here as STEMgage grows. Are you a reporter or
              partner who wants to feature our work? We would love to hear from you.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Events() {
  const [q, setQ] = useState("");
  const filtered = events.filter(
    (e) => (e.title + " " + e.branch).toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="sg-section sg-pagetop">
      <div className="sg-container">
        <Reveal>
          <Eyebrow color={C.sprout}>EVENTS</Eyebrow>
          <h1 className="sg-h2 sg-h2-lg">The next few months of building.</h1>
          <div className="sg-bigpill">
            <CheckCircle2 size={18} aria-hidden="true" />
            Library events do not require registration. Just show up.
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="sg-search">
            <Search size={18} color={C.cobalt} aria-hidden="true" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by challenge or library branch"
              aria-label="Search events"
            />
          </div>
        </Reveal>

        <p className="sg-mono-label sg-timeline-hint" style={{ color: C.cobalt }}>
          ← SCROLL THE TIMELINE →
        </p>
        <div className="sg-timeline" role="list">
          {filtered.map((ev) => (
            <div role="listitem" key={ev.title} className="sg-timeline-item">
              <span className="sg-timeline-dot" aria-hidden="true" />
              <EventCard ev={ev} />
            </div>
          ))}
          {filtered.length === 0 && <p className="sg-empty">No events match that search.</p>}
        </div>

        <p className="sg-disclaimer">
          Dates shown are sample placeholders. Swap in your confirmed library dates before launch.
        </p>
      </div>
    </div>
  );
}

function TeamCard({ person, accent }) {
  return (
    <div className="sg-person">
      <div className="sg-avatar" style={{ background: `linear-gradient(135deg, ${accent}, ${C.cobalt})` }}>
        <span>{initials(person.name)}</span>
      </div>
      <h3>{person.name}</h3>
      <span className="sg-role" style={{ color: accent }}>{person.role}</span>
      <p className="sg-person-bio">
        How they got into STEM, a short story goes here. Add a sentence or two in each person's own voice.
      </p>
    </div>
  );
}

function Team() {
  return (
    <div className="sg-section sg-pagetop">
      <div className="sg-container">
        <Reveal>
          <Eyebrow>THE TEAM</Eyebrow>
          <h1 className="sg-h2 sg-h2-lg">The people behind the builds.</h1>
          <p className="sg-body sg-measure">
            STEMgage is run by students who believe the best way to learn STEM is to make something with
            your hands. Photos and personal stories are placeholders for now.
          </p>
        </Reveal>

        <Reveal><h2 className="sg-h3 sg-mt">Co-founders</h2></Reveal>
        <div className="sg-people">
          {team.founders.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}><TeamCard person={p} accent={C.sunnyDeep} /></Reveal>
          ))}
        </div>

        <Reveal><h2 className="sg-h3 sg-mt">Volunteers</h2></Reveal>
        <div className="sg-people">
          {team.volunteers.map((p, i) => (
            <Reveal key={p.name} delay={i * 60}><TeamCard person={p} accent={C.sprout} /></Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Parent", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = () => setSent(true);

  return (
    <div className="sg-section sg-pagetop">
      <div className="sg-container sg-contact">
        <div>
          <Reveal>
            <Eyebrow color={C.coral}>CONTACT</Eyebrow>
            <h1 className="sg-h2 sg-h2-lg">Let's build something together.</h1>
            <p className="sg-body">
              Parents, librarians, educators, and volunteers, we want to hear from you. Reach out to bring
              STEMgage to your community or just to say hello.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <ul className="sg-contact-list">
              <li><a href="mailto:stemgage25@gmail.com"><Mail size={18} aria-hidden="true" /> stemgage25@gmail.com</a></li>
              <li><a href="tel:5618460346"><Phone size={18} aria-hidden="true" /> 561-846-0346</a></li>
            </ul>
            <div className="sg-socials">
              <a href="#" aria-label="STEMgage on Instagram" className="sg-social"><Instagram size={20} /></a>
              <a href="#" aria-label="STEMgage on Facebook" className="sg-social"><Facebook size={20} /></a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="sg-form-card">
            {sent ? (
              <div className="sg-form-success" role="status" aria-live="polite">
                <CheckCircle2 size={44} color={C.sprout} aria-hidden="true" />
                <h3>Message ready to send</h3>
                <p>Thanks {form.name || "friend"}. This is a demo form, so connect it to email or a form
                  service before launch. We will get back to you soon.</p>
              </div>
            ) : (
              <div className="sg-form">
                <h3 className="sg-h3">Send us a note</h3>
                <label>Your name
                  <input value={form.name} onChange={set("name")} placeholder="Jordan Smith" />
                </label>
                <label>Email
                  <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
                </label>
                <label>I am a
                  <select value={form.role} onChange={set("role")}>
                    <option>Parent</option>
                    <option>Library or community center</option>
                    <option>Educator</option>
                    <option>Volunteer</option>
                    <option>Donor or sponsor</option>
                  </select>
                </label>
                <label>Message
                  <textarea rows={4} value={form.message} onChange={set("message")} placeholder="Tell us how we can help." />
                </label>
                <Button full onClick={submit}>Send message <ArrowRight size={18} /></Button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ---------- shell ---------- */

const NAV = [
  ["home", "Home"], ["about", "About"], ["impact", "Impact"],
  ["events", "Events"], ["team", "Team"], ["contact", "Contact"],
];

function Logo({ go }) {
  return (
    <button className="sg-logo" onClick={() => go("home")} aria-label="STEMgage home">
      <span className="sg-logo-mark"><Sparkles size={18} color="#fff" aria-hidden="true" /></span>
      <span className="sg-logo-text">STEM<span style={{ color: C.sunnyDeep }}>gage</span></span>
    </button>
  );
}

function Footer({ go }) {
  const [sub, setSub] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <footer className="sg-footer">
      <div className="sg-grid-overlay" aria-hidden="true" />
      <div className="sg-container sg-footer-grid">
        <div>
          <Logo go={go} />
          <p className="sg-footer-blurb">
            Free, hands-on STEM for elementary kids across Palm Beach County. Built by students,
            for the next generation of builders.
          </p>
          <div className="sg-socials">
            <a href="#" aria-label="STEMgage on Instagram" className="sg-social sg-social-dark"><Instagram size={18} /></a>
            <a href="#" aria-label="STEMgage on Facebook" className="sg-social sg-social-dark"><Facebook size={18} /></a>
          </div>
        </div>

        <nav aria-label="Footer">
          <h4>Explore</h4>
          {NAV.map(([id, label]) => (
            <button key={id} className="sg-footer-link" onClick={() => go(id)}>{label}</button>
          ))}
        </nav>

        <div>
          <h4>Get in touch</h4>
          <a className="sg-footer-link" href="mailto:stemgage25@gmail.com">stemgage25@gmail.com</a>
          <a className="sg-footer-link" href="tel:5618460346">561-846-0346</a>
        </div>

        <div className="sg-news">
          <h4>Stay in the loop</h4>
          <p className="sg-footer-blurb">Get a heads up before the next event.</p>
          {sub ? (
            <p className="sg-news-thanks" role="status"><CheckCircle2 size={16} color={C.sprout} aria-hidden="true" /> You're on the list.</p>
          ) : (
            <div className="sg-news-form">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email for newsletter"
              />
              <button onClick={() => setSub(true)} aria-label="Sign up for the newsletter">
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="sg-container sg-footer-base">
        <span>© {new Date().getFullYear()} STEMgage. A student-run nonprofit.</span>
        <span className="sg-mono-label" style={{ color: "rgba(255,255,255,.5)" }}>HANDS-ON STEM · PALM BEACH COUNTY</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [open, setOpen] = useState(false);
  const topRef = useRef(null);

  const go = (p) => { setPage(p); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="sg-root" ref={topRef}>
      <style>{styles}</style>

      <header className="sg-nav">
        <div className="sg-container sg-nav-inner">
          <Logo go={go} />
          <nav className="sg-nav-links" aria-label="Primary">
            {NAV.map(([id, label]) => (
              <button
                key={id}
                className={`sg-nav-link ${page === id ? "is-active" : ""}`}
                onClick={() => go(id)}
                aria-current={page === id ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="sg-nav-cta"><Button onClick={() => go("events")}>Find an event</Button></div>
          <button className="sg-burger" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {open && (
          <div className="sg-mobile-menu">
            {NAV.map(([id, label]) => (
              <button key={id} className={`sg-mobile-link ${page === id ? "is-active" : ""}`} onClick={() => go(id)}>{label}</button>
            ))}
            <Button full onClick={() => go("events")}>Find an event</Button>
          </div>
        )}
      </header>

      <main>
        {page === "home" && <Home go={go} />}
        {page === "about" && <About />}
        {page === "impact" && <Impact />}
        {page === "events" && <Events />}
        {page === "team" && <Team />}
        {page === "contact" && <Contact />}
      </main>

      <Footer go={go} />
    </div>
  );
}

/* ---------- styles ---------- */

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=Space+Mono:wght@700&display=swap');

:root{
  --ink:${C.ink}; --blueprint:${C.blueprint}; --cobalt:${C.cobalt}; --cobaltDeep:${C.cobaltDeep};
  --sky:${C.sky}; --sunny:${C.sunny}; --sunnyDeep:${C.sunnyDeep}; --sprout:${C.sprout};
  --coral:${C.coral}; --paper:${C.paper};
}
.sg-root{ font-family:'Nunito',system-ui,sans-serif; color:var(--ink); background:#fff; line-height:1.6; }
.sg-root *{ box-sizing:border-box; }
.sg-container{ max-width:1140px; margin:0 auto; padding:0 22px; }
button{ font-family:inherit; cursor:pointer; }
a{ color:inherit; text-decoration:none; }

.sg-mono-label{ font-family:'Space Mono',monospace; font-size:11px; letter-spacing:.18em; text-transform:uppercase; }
.sg-eyebrow{ font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.2em; text-transform:uppercase; margin-bottom:14px; }

h1,h2,h3,h4{ font-family:'Fredoka',sans-serif; color:var(--ink); line-height:1.1; margin:0; }
.sg-h1{ font-size:clamp(34px,5.4vw,60px); font-weight:700; letter-spacing:-.01em; }
.sg-h2{ font-size:clamp(26px,3.6vw,40px); font-weight:600; }
.sg-h2-lg{ font-size:clamp(30px,4.4vw,50px); }
.sg-h3{ font-size:clamp(20px,2.4vw,26px); font-weight:600; }
.sg-lead{ font-size:clamp(16px,1.7vw,19px); color:#3a4a78; max-width:34em; margin:18px 0 26px; }
.sg-body{ font-size:16.5px; color:#3a4a78; margin:0 0 14px; }
.sg-measure{ max-width:40em; }
.sg-underline{ position:relative; color:var(--cobalt); white-space:nowrap; }
.sg-underline:after{ content:''; position:absolute; left:0; right:0; bottom:4px; height:10px; background:var(--sunny); opacity:.55; border-radius:6px; z-index:-1; }

/* grid overlay (blueprint signature) */
.sg-grid-overlay{ position:absolute; inset:0; pointer-events:none;
  background-image:linear-gradient(rgba(255,255,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.18) 1px,transparent 1px);
  background-size:26px 26px; }

/* buttons */
.sg-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; border:none;
  font-weight:800; font-size:15.5px; padding:13px 22px; border-radius:999px; transition:transform .15s ease, box-shadow .15s ease, background .15s ease; }
.sg-btn-solid{ background:var(--cobaltDeep); color:#fff; box-shadow:0 8px 20px rgba(26,79,208,.28); }
.sg-btn-solid:hover{ transform:translateY(-2px); box-shadow:0 12px 26px rgba(26,79,208,.36); }
.sg-btn-yellow{ background:var(--sunny); color:var(--ink); box-shadow:0 8px 20px rgba(244,168,0,.3); }
.sg-btn-yellow:hover{ transform:translateY(-2px); background:var(--sunnyDeep); }
.sg-btn-ghost{ background:transparent; color:var(--cobaltDeep); border:2px solid #cdddff; padding:11px 20px; }
.sg-btn-ghost:hover{ background:var(--sky); transform:translateY(-2px); }

/* nav */
.sg-nav{ position:sticky; top:0; z-index:50; background:rgba(255,255,255,.9); backdrop-filter:blur(10px); border-bottom:1px solid #e6edfb; }
.sg-nav-inner{ display:flex; align-items:center; justify-content:space-between; height:70px; gap:16px; }
.sg-logo{ display:flex; align-items:center; gap:10px; background:none; border:none; padding:0; }
.sg-logo-mark{ width:34px; height:34px; border-radius:10px; display:grid; place-items:center; background:linear-gradient(135deg,var(--cobalt),var(--sprout)); box-shadow:0 4px 10px rgba(43,107,239,.3); }
.sg-logo-text{ font-family:'Fredoka',sans-serif; font-weight:700; font-size:22px; color:var(--ink); }
.sg-nav-links{ display:flex; gap:4px; }
.sg-nav-link{ background:none; border:none; font-weight:700; font-size:15px; color:#4a597f; padding:8px 14px; border-radius:999px; transition:.15s; }
.sg-nav-link:hover{ color:var(--cobaltDeep); background:var(--sky); }
.sg-nav-link.is-active{ color:var(--cobaltDeep); background:var(--sky); }
.sg-burger{ display:none; background:var(--sky); border:none; color:var(--ink); width:44px; height:44px; border-radius:12px; align-items:center; justify-content:center; }
.sg-mobile-menu{ display:flex; flex-direction:column; gap:6px; padding:14px 22px 22px; border-top:1px solid #e6edfb; background:#fff; }
.sg-mobile-link{ text-align:left; background:none; border:none; font-weight:700; font-size:17px; color:#3a4a78; padding:12px 10px; border-radius:12px; }
.sg-mobile-link.is-active{ background:var(--sky); color:var(--cobaltDeep); }

/* hero */
.sg-hero{ position:relative; overflow:hidden; background:linear-gradient(180deg,#fff 0%, var(--sky) 100%); padding:48px 0 70px; }
.sg-hero-grid{ opacity:.5; background-image:linear-gradient(rgba(43,107,239,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(43,107,239,.06) 1px,transparent 1px); background-size:30px 30px; }
.sg-hero-inner{ position:relative; display:grid; grid-template-columns:1.05fr .95fr; gap:48px; align-items:center; }
.sg-hero-copy{ position:relative; z-index:2; }
.sg-badge{ display:inline-flex; align-items:center; gap:8px; background:#fff; color:var(--sprout); border:1.5px solid #bfe9d2; font-weight:800; font-size:13.5px; padding:8px 14px; border-radius:999px; margin-bottom:20px; box-shadow:0 4px 12px rgba(47,191,113,.12); }
.sg-hero-ctas{ display:flex; flex-wrap:wrap; gap:12px; }
.sg-rotator{ margin-top:26px; display:flex; align-items:center; gap:10px; background:#fff; border:1.5px dashed #cdddff; border-radius:14px; padding:12px 16px; font-weight:700; color:var(--cobaltDeep); max-width:30em; }
.sg-rotator-text{ animation:sgFade .5s ease; }
.sg-blob{ position:absolute; border-radius:50%; filter:blur(2px); opacity:.5; animation:sgFloat 9s ease-in-out infinite; }
.sg-blob-1{ width:160px; height:160px; background:var(--sunny); top:-30px; right:8%; }
.sg-blob-2{ width:120px; height:120px; background:var(--sprout); bottom:30px; left:-30px; animation-delay:2s; }

/* carousel */
.sg-carousel{ position:relative; z-index:2; }
.sg-carousel-frame{ position:relative; border-radius:24px; overflow:hidden; aspect-ratio:4/3.4; box-shadow:0 24px 50px rgba(17,34,80,.18); border:6px solid #fff; }
.sg-slide{ position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; opacity:0; transform:scale(1.04); transition:opacity .7s ease, transform .7s ease; }
.sg-slide.is-active{ opacity:1; transform:scale(1); }
.sg-slide-cap{ position:absolute; left:20px; bottom:20px; display:flex; flex-direction:column; color:#fff; text-shadow:0 2px 8px rgba(0,0,0,.25); }
.sg-slide-cap strong{ font-family:'Fredoka',sans-serif; font-size:26px; }
.sg-arrow{ position:absolute; top:50%; transform:translateY(-50%); width:40px; height:40px; border-radius:50%; border:none; background:rgba(255,255,255,.92); color:var(--ink); display:grid; place-items:center; box-shadow:0 4px 12px rgba(0,0,0,.18); }
.sg-arrow:hover{ background:#fff; }
.sg-arrow-l{ left:12px; } .sg-arrow-r{ right:12px; }
.sg-dots{ display:flex; gap:8px; justify-content:center; margin-top:16px; }
.sg-dot{ width:10px; height:10px; border-radius:50%; border:none; background:#c7d6f5; transition:.2s; }
.sg-dot.is-active{ background:var(--cobalt); width:26px; border-radius:999px; }

/* sections */
.sg-section{ padding:64px 0; }
.sg-pagetop{ padding-top:48px; }
.sg-paper{ background:var(--paper); }
.sg-mt{ margin-top:34px; margin-bottom:18px; }
.sg-row-between{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:26px; }

/* stats */
.sg-stats-band{ padding:0; }
.sg-stats{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; background:#fff; border:1px solid #e6edfb; border-radius:22px; padding:30px; margin-top:-44px; position:relative; z-index:5; box-shadow:0 18px 40px rgba(17,34,80,.08); }
.sg-stat{ text-align:center; }
.sg-stat-value{ font-family:'Fredoka',sans-serif; font-weight:700; font-size:clamp(30px,4vw,44px); line-height:1; }
.sg-stat-label{ font-size:14px; color:#5a6a92; margin-top:8px; font-weight:600; }

/* mission */
.sg-mission{ display:grid; grid-template-columns:1.1fr .9fr; gap:46px; align-items:center; }

/* tiles */
.sg-tile{ background:#fff; border:1px solid #e6edfb; border-radius:18px; overflow:hidden; box-shadow:0 10px 26px rgba(17,34,80,.07); }
.sg-tile-art{ position:relative; min-height:160px; display:grid; place-items:center; }
.sg-tile-meta{ display:flex; flex-direction:column; gap:2px; padding:14px 16px; }

/* steps */
.sg-steps{ display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-top:30px; }
.sg-step{ position:relative; background:#fff; border:1px solid #e6edfb; border-radius:18px; padding:24px 20px; height:100%; transition:transform .18s ease, box-shadow .18s ease; }
.sg-step:hover{ transform:translateY(-4px); box-shadow:0 14px 30px rgba(17,34,80,.1); }
.sg-step-num{ font-family:'Space Mono',monospace; font-size:13px; color:var(--sunnyDeep); letter-spacing:.1em; }
.sg-step-icon{ display:grid; place-items:center; width:46px; height:46px; border-radius:12px; background:var(--sky); margin:10px 0 12px; }
.sg-step h3{ font-size:19px; margin-bottom:6px; }
.sg-step p{ font-size:14.5px; color:#5a6a92; margin:0; }

/* horizontal scroll */
.sg-hscroll{ display:flex; gap:18px; overflow-x:auto; padding:6px 2px 18px; scroll-snap-type:x mandatory; }
.sg-hscroll-item{ flex:0 0 300px; scroll-snap-align:start; }
.sg-note{ display:inline-flex; align-items:center; gap:8px; color:var(--sprout); font-weight:800; font-size:15px; }

/* event card */
.sg-event{ background:#fff; border:1px solid #e6edfb; border-radius:18px; overflow:hidden; box-shadow:0 10px 26px rgba(17,34,80,.07); height:100%; transition:transform .18s ease, box-shadow .18s ease; }
.sg-event:hover{ transform:translateY(-4px); box-shadow:0 18px 36px rgba(17,34,80,.12); }
.sg-event-art{ position:relative; height:110px; display:grid; place-items:center; }
.sg-event-body{ padding:18px; }
.sg-pill{ display:inline-block; background:#eafaf1; color:var(--sprout); font-weight:800; font-size:12px; padding:5px 11px; border-radius:999px; margin-bottom:10px; }
.sg-event-body h3{ font-size:19px; margin-bottom:8px; }
.sg-event-desc{ font-size:14.5px; color:#5a6a92; margin:0 0 14px; }
.sg-event-meta{ list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:7px; }
.sg-event-meta li{ display:flex; align-items:center; gap:8px; font-size:14px; color:#3a4a78; font-weight:600; }
.sg-event-meta svg{ color:var(--cobalt); flex:0 0 auto; }

/* cta band */
.sg-cta-band{ position:relative; overflow:hidden; border-radius:26px; background:linear-gradient(130deg,var(--cobaltDeep),var(--cobalt)); color:#fff; }
.sg-cta-band-inner{ position:relative; z-index:2; display:flex; align-items:center; gap:22px; padding:36px 40px; flex-wrap:wrap; }
.sg-cta-band-inner > div{ flex:1; min-width:240px; }
.sg-cta-title{ color:#fff; font-size:clamp(22px,2.6vw,30px); margin-bottom:8px; }
.sg-cta-band-inner p{ color:rgba(255,255,255,.9); margin:0; font-size:15.5px; }

/* prose / cards */
.sg-prose > *{ margin-bottom:26px; }
.sg-card-soft{ background:var(--paper); border:1px solid #e6edfb; border-radius:20px; padding:30px 32px; }
.sg-chip-row{ display:flex; flex-wrap:wrap; gap:10px; margin-top:16px; }
.sg-chip{ display:inline-flex; align-items:center; gap:6px; background:var(--sky); color:var(--cobaltDeep); font-weight:700; font-size:14px; padding:7px 14px; border-radius:999px; }
.sg-chip svg{ color:var(--cobalt); }

/* search */
.sg-search{ display:flex; align-items:center; gap:10px; background:#fff; border:1.5px solid #d7e2fb; border-radius:14px; padding:11px 16px; max-width:440px; margin:22px 0 10px; }
.sg-search input{ border:none; outline:none; font-family:inherit; font-size:15.5px; width:100%; color:var(--ink); background:transparent; }

/* gallery */
.sg-gallery{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:14px; }
.sg-gallery-blurb{ font-size:14.5px; color:#5a6a92; margin:12px 4px 0; }
.sg-moments{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.sg-empty{ color:#7585a8; font-weight:600; }

/* press */
.sg-press{ margin-top:46px; background:linear-gradient(135deg,#fff,var(--sky)); border:1px solid #e6edfb; border-radius:22px; padding:34px; }
.sg-press h2{ margin:12px 0 8px; }

/* events timeline */
.sg-bigpill{ display:inline-flex; align-items:center; gap:10px; background:var(--sprout); color:#fff; font-weight:800; font-size:15.5px; padding:12px 20px; border-radius:999px; margin-top:6px; box-shadow:0 10px 22px rgba(47,191,113,.28); }
.sg-timeline-hint{ margin:26px 0 8px; }
.sg-timeline{ display:flex; gap:22px; overflow-x:auto; padding:24px 2px 26px; scroll-snap-type:x mandatory; border-top:2px dashed #d7e2fb; }
.sg-timeline-item{ position:relative; flex:0 0 320px; scroll-snap-align:start; padding-top:14px; }
.sg-timeline-dot{ position:absolute; top:-9px; left:24px; width:16px; height:16px; border-radius:50%; background:var(--sunny); border:3px solid #fff; box-shadow:0 0 0 2px var(--sunny); }
.sg-disclaimer{ font-size:13.5px; color:#8a97b8; margin-top:18px; font-style:italic; }

/* team */
.sg-people{ display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
.sg-person{ background:#fff; border:1px solid #e6edfb; border-radius:20px; padding:26px; text-align:center; transition:transform .18s ease, box-shadow .18s ease; }
.sg-person:hover{ transform:translateY(-4px); box-shadow:0 16px 34px rgba(17,34,80,.1); }
.sg-avatar{ width:84px; height:84px; border-radius:50%; margin:0 auto 14px; display:grid; place-items:center; color:#fff; font-family:'Fredoka',sans-serif; font-weight:700; font-size:28px; box-shadow:0 8px 18px rgba(43,107,239,.25); }
.sg-person h3{ font-size:20px; }
.sg-role{ font-family:'Space Mono',monospace; font-size:12px; letter-spacing:.12em; text-transform:uppercase; display:block; margin:6px 0 12px; }
.sg-person-bio{ font-size:14px; color:#6a7aa0; margin:0; }

/* contact */
.sg-contact{ display:grid; grid-template-columns:1fr 1fr; gap:44px; align-items:start; }
.sg-contact-list{ list-style:none; padding:0; margin:22px 0 18px; display:flex; flex-direction:column; gap:12px; }
.sg-contact-list a{ display:inline-flex; align-items:center; gap:10px; font-weight:700; font-size:17px; color:var(--ink); }
.sg-contact-list svg{ color:var(--cobalt); }
.sg-socials{ display:flex; gap:10px; }
.sg-social{ width:42px; height:42px; border-radius:12px; display:grid; place-items:center; background:var(--sky); color:var(--cobaltDeep); transition:.15s; }
.sg-social:hover{ background:var(--cobalt); color:#fff; transform:translateY(-2px); }
.sg-social-dark{ background:rgba(255,255,255,.12); color:#fff; }
.sg-social-dark:hover{ background:var(--sunny); color:var(--ink); }
.sg-form-card{ background:#fff; border:1px solid #e6edfb; border-radius:22px; padding:30px; box-shadow:0 16px 38px rgba(17,34,80,.08); }
.sg-form{ display:flex; flex-direction:column; gap:14px; }
.sg-form label{ display:flex; flex-direction:column; gap:7px; font-weight:700; font-size:14px; color:var(--ink); }
.sg-form input,.sg-form select,.sg-form textarea{ font-family:inherit; font-size:15.5px; padding:12px 14px; border:1.5px solid #d7e2fb; border-radius:12px; outline:none; color:var(--ink); background:#fff; }
.sg-form input:focus,.sg-form select:focus,.sg-form textarea:focus{ border-color:var(--cobalt); box-shadow:0 0 0 3px rgba(43,107,239,.15); }
.sg-form-success{ text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px; padding:18px 6px; }
.sg-form-success p{ color:#5a6a92; margin:0; }

/* footer */
.sg-footer{ position:relative; overflow:hidden; background:var(--blueprint); color:#fff; padding:54px 0 26px; margin-top:20px; }
.sg-footer .sg-grid-overlay{ opacity:.25; }
.sg-footer-grid{ position:relative; z-index:2; display:grid; grid-template-columns:1.4fr .8fr .9fr 1fr; gap:30px; }
.sg-footer .sg-logo-text{ color:#fff; }
.sg-footer-blurb{ color:rgba(255,255,255,.72); font-size:14.5px; margin:14px 0; max-width:30em; }
.sg-footer h4{ color:#fff; font-size:16px; margin-bottom:14px; }
.sg-footer-link{ display:block; background:none; border:none; text-align:left; color:rgba(255,255,255,.78); font-size:14.5px; font-weight:600; padding:5px 0; transition:.15s; }
.sg-footer-link:hover{ color:var(--sunny); }
.sg-news-form{ display:flex; gap:8px; }
.sg-news-form input{ flex:1; min-width:0; border:none; border-radius:12px; padding:11px 14px; font-family:inherit; font-size:14.5px; }
.sg-news-form button{ width:46px; border:none; border-radius:12px; background:var(--sunny); color:var(--ink); display:grid; place-items:center; }
.sg-news-form button:hover{ background:var(--sunnyDeep); }
.sg-news-thanks{ display:inline-flex; align-items:center; gap:8px; color:#9fe9c1; font-weight:700; }
.sg-footer-base{ position:relative; z-index:2; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-top:36px; padding-top:20px; border-top:1px solid rgba(255,255,255,.12); color:rgba(255,255,255,.6); font-size:13.5px; }

/* reveal + keyframes */
.sg-reveal{ opacity:0; transform:translateY(22px); transition:opacity .6s ease, transform .6s ease; }
.sg-reveal.is-visible{ opacity:1; transform:none; }
@keyframes sgFloat{ 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-16px); } }
@keyframes sgFade{ from{ opacity:0; transform:translateY(6px); } to{ opacity:1; transform:none; } }

:focus-visible{ outline:3px solid var(--cobalt); outline-offset:3px; border-radius:6px; }

/* responsive */
@media (max-width:920px){
  .sg-hero-inner{ grid-template-columns:1fr; gap:34px; }
  .sg-mission{ grid-template-columns:1fr; gap:28px; }
  .sg-stats{ grid-template-columns:repeat(2,1fr); }
  .sg-steps{ grid-template-columns:repeat(2,1fr); }
  .sg-gallery,.sg-moments,.sg-people{ grid-template-columns:repeat(2,1fr); }
  .sg-contact{ grid-template-columns:1fr; gap:30px; }
  .sg-footer-grid{ grid-template-columns:1fr 1fr; }
  .sg-nav-links,.sg-nav-cta{ display:none; }
  .sg-burger{ display:grid; }
}
@media (max-width:560px){
  .sg-stats{ grid-template-columns:1fr 1fr; }
  .sg-steps,.sg-gallery,.sg-moments,.sg-people,.sg-footer-grid{ grid-template-columns:1fr; }
  .sg-cta-band-inner{ padding:28px 24px; }
  .sg-section{ padding:48px 0; }
}
@media (prefers-reduced-motion:reduce){
  *{ animation:none !important; transition:none !important; }
  .sg-reveal{ opacity:1; transform:none; }
}
`;
