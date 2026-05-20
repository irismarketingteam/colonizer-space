const now = new Date()
const hoursAgo = (h) => new Date(now - h * 3600000).toISOString()
const daysAgo = (d) => new Date(now - d * 86400000).toISOString()

export const SEED_ARTICLES = [
  {
    id: '1',
    slug: 'axiom-station-module-3-docking',
    title: 'Axiom Station Module 3 Completes Docking With ISS',
    subtitle: 'The commercial segment inches closer to standalone capability as Module 3 locks into place.',
    section: 'orbit',
    body_md: `Axiom Space's third commercial module successfully docked with the International Space Station early Tuesday morning, marking a critical milestone in the company's plan to build the first commercial successor to the ISS.

## What Happened

The module, designated AxM-3, launched aboard a SpaceX Falcon 9 from Kennedy Space Center at 4:12 AM ET and reached the station's forward port after a 26-hour transit. Docking was confirmed at 6:38 AM ET.

AxM-3 is the third of four planned modules that will eventually form Axiom Station, a free-flying commercial outpost. The module adds 120 cubic meters of pressurized volume dedicated to manufacturing and research operations.

## Why It Matters

The docking of AxM-3 means Axiom Station now has enough volume and power generation capacity to theoretically operate independently, though detachment from the ISS is still scheduled for late 2028.

This is significant for NASA's commercial LEO strategy. The agency has committed $3.5 billion in funding to ensure commercial stations are operational before the ISS is deorbited, currently planned for 2031.

## What to Watch

Axiom's fourth and final module, AxM-4, is scheduled for launch in Q2 2027. Once attached, the company plans to begin phased separation from the ISS. The timeline is aggressive but trackable.`,
    excerpt: "Axiom's third module docks with the ISS, bringing the commercial station closer to standalone operations and reshaping LEO's future.",
    cover_image_url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&h=675&fit=crop',
    cover_image_alt: 'International Space Station in orbit',
    cover_image_credit: 'NASA',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['axiom', 'iss', 'commercial-station', 'leo'],
    source_urls: ['https://www.axiomspace.com'],
    reading_time_min: 4,
    published_at: hoursAgo(1),
    created_at: hoursAgo(3),
  },
  {
    id: '2',
    slug: 'starship-v3-static-fire',
    title: 'Starship V3 Completes First Full-Duration Static Fire',
    subtitle: 'All 33 Raptor 3 engines fired for the full planned duration at Starbase.',
    section: 'rockets',
    body_md: `SpaceX conducted a full-duration static fire of the Starship V3 booster at its Starbase facility in Boca Chica, Texas on Monday. All 33 Raptor 3 engines fired for the complete test duration.

## The Test

The static fire lasted approximately 30 seconds, significantly longer than previous V2 booster tests. SpaceX confirmed via its social media channels that all engines performed nominally throughout the burn.

Raptor 3 engines feature a redesigned turbopump and simplified plumbing that reduces engine mass by roughly 25% compared to Raptor 2. The improvements are critical for achieving the payload capacity needed for Mars-class missions.

## Timeline Implications

A successful full-duration static fire typically precedes a launch attempt by 4-8 weeks in SpaceX's development cadence. This suggests a Starship V3 orbital test flight could occur by late summer.

The V3 variant is the version SpaceX intends to use for operational Starlink V3 deployment and, eventually, crew missions to the Moon under NASA's HLS contract.

## The Bigger Picture

Starship V3 represents the architecture SpaceX plans to use for initial Mars cargo missions. Its increased payload capacity and improved engine reliability are prerequisites for the multi-ship Mars convoy concept Elon Musk has outlined.`,
    excerpt: 'SpaceX fires all 33 Raptor 3 engines on the Starship V3 booster for the first time, clearing a major development hurdle.',
    cover_image_url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&h=675&fit=crop',
    cover_image_alt: 'Rocket engine test',
    cover_image_credit: 'SpaceX',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['spacex', 'starship', 'raptor', 'static-fire'],
    source_urls: ['https://www.spacex.com'],
    reading_time_min: 3,
    published_at: hoursAgo(5),
    created_at: hoursAgo(7),
  },
  {
    id: '3',
    slug: 'nasa-artemis-3-landing-site',
    title: "NASA Selects Shackleton Rim for Artemis III Landing",
    subtitle: 'The south pole site offers permanent shadow for ice access and ridgeline solar power.',
    section: 'moon',
    body_md: `NASA has formally selected the Shackleton Crater rim as the primary landing site for the Artemis III crewed lunar mission, the agency announced Wednesday.

## Site Selection

The Shackleton Crater rim, located near the lunar south pole, was chosen from a shortlist of 13 candidate regions evaluated over two years. The site offers a combination of near-permanent solar illumination on the ridgeline and permanently shadowed crater floors where water ice deposits have been confirmed by orbital instruments.

## Why Shackleton

The location serves dual strategic purposes. The ridgeline provides consistent solar power, critical for extended surface operations. The crater interior, which never receives sunlight, contains ice deposits that could eventually be processed into drinking water, oxygen, and rocket propellant.

NASA's selection also considered terrain safety, communications geometry with Earth, and proximity to scientifically valuable geological formations.

## What This Means for Colonization

Shackleton has long been considered the most likely site for a permanent lunar outpost. NASA's formal selection validates years of site analysis and positions the crater as the probable location for the Artemis Base Camp, planned for the early 2030s.

The ice deposits are particularly significant. In-situ resource utilization at Shackleton could reduce the cost of maintaining a lunar presence by orders of magnitude compared to resupply from Earth.`,
    excerpt: "NASA picks Shackleton Crater's rim for the first crewed lunar landing since Apollo, prioritizing ice access and solar power.",
    cover_image_url: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=1200&h=675&fit=crop',
    cover_image_alt: 'Lunar surface',
    cover_image_credit: 'NASA',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['nasa', 'artemis', 'moon', 'shackleton', 'isru'],
    source_urls: ['https://www.nasa.gov'],
    reading_time_min: 4,
    published_at: hoursAgo(12),
    created_at: hoursAgo(14),
  },
  {
    id: '4',
    slug: 'vast-haven-2-crew-module',
    title: 'Vast Unveils Haven-2 Crew Module Design',
    subtitle: 'The station operator reveals an expanded habitat capable of supporting six crew for extended stays.',
    section: 'orbit',
    body_md: `Vast, the Long Beach-based company building commercial space stations, revealed the final design of its Haven-2 crew module at a press event Tuesday.

## The Design

Haven-2 nearly doubles the pressurized volume of Haven-1, Vast's single-module station currently under construction. The module features six private crew quarters, a shared galley, and a cupola-style observation window.

The design emphasizes livability over laboratory function. Vast CEO Max Haot described it as optimized for stays of 30-90 days, targeting both professional astronauts and private clients.

## Market Position

Haven-2 positions Vast as a direct competitor to Axiom Space in the commercial station market. While Axiom is building a multi-module complex attached to the ISS, Vast is pursuing a faster path to free-flying operations.

## Launch Vehicle

Haven-2 is designed to launch on SpaceX's Starship, which provides the payload volume needed for the module's 8-meter diameter. This is notably wider than anything that could fit inside a Falcon 9 fairing.`,
    excerpt: "Vast's Haven-2 module targets extended crew stays with six private quarters and a livability-first design philosophy.",
    cover_image_url: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1200&h=675&fit=crop',
    cover_image_alt: 'Astronaut on space station',
    cover_image_credit: 'NASA',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['vast', 'haven', 'commercial-station', 'habitat'],
    source_urls: [],
    reading_time_min: 3,
    published_at: daysAgo(1),
    created_at: daysAgo(1),
  },
  {
    id: '5',
    slug: 'lumen-orbit-space-data-center',
    title: 'Lumen Orbit Raises $80M for Orbital Data Centers',
    subtitle: 'The startup plans to launch server racks into LEO by 2028, powered by uninterrupted solar energy.',
    section: 'tech',
    body_md: `Lumen Orbit, a startup building data centers in low Earth orbit, closed an $80 million Series B round led by Andreessen Horowitz with participation from Founders Fund.

## The Concept

Lumen Orbit proposes launching server racks into LEO where they can operate on continuous solar power without the cooling and energy constraints of terrestrial data centers. The company claims a 40% reduction in total cost of ownership for AI training workloads.

## Technical Approach

Each Lumen module is a self-contained server rack with integrated solar panels and radiative cooling systems. The modules are designed to launch on Falcon 9 rideshare missions and operate autonomously.

Data transfer to and from the orbital data center uses optical laser links to ground stations, a technology already proven by SpaceX's Starlink inter-satellite links.

## Market Context

The AI compute boom has driven terrestrial data center demand to unprecedented levels. Power constraints are the primary bottleneck, with some facilities waiting years for grid connections. Orbital data centers sidestep this entirely.

## What to Watch

Lumen plans a pathfinder mission in late 2027 with a single server rack module. If successful, full commercial operations could begin in 2029.`,
    excerpt: "Lumen Orbit closes $80M Series B to build AI data centers in low Earth orbit, bypassing terrestrial power constraints.",
    cover_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop',
    cover_image_alt: 'Earth from space at night',
    cover_image_credit: 'NASA',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['lumen-orbit', 'data-center', 'ai', 'space-infrastructure'],
    source_urls: [],
    reading_time_min: 4,
    published_at: daysAgo(1),
    created_at: daysAgo(1),
  },
  {
    id: '6',
    slug: 'mars-sample-return-redesign',
    title: 'NASA Overhauls Mars Sample Return Architecture',
    subtitle: 'The revised plan cuts cost by $4 billion and accelerates the return date by two years.',
    section: 'mars',
    body_md: `NASA unveiled a fundamentally redesigned Mars Sample Return mission architecture that reduces the estimated cost from $11 billion to under $7 billion and moves the sample return date from 2040 to 2038.

## What Changed

The original architecture called for a dedicated Mars lander, an ascent vehicle, and a European-built orbiter. The redesigned mission uses two smaller commercial landers and eliminates the separate ascent vehicle by integrating launch capability into the lander design.

NASA selected Rocket Lab and SpaceX to provide the lander platforms under fixed-price contracts totaling $1.8 billion.

## Why It Matters

The Perseverance rover has been collecting and caching samples on the Martian surface since 2021. These samples contain material from ancient river delta deposits that scientists believe offer the best chance of detecting signs of past microbial life.

Getting those samples to Earth has been NASA's highest science priority for a decade. The original cost trajectory threatened to consume the entire planetary science budget.

## The Commercial Angle

The shift to commercial landers represents NASA's most aggressive use of the commercial services model outside of LEO. If it works, the approach could become the template for all future Mars surface missions.`,
    excerpt: "NASA's redesigned Mars Sample Return cuts costs by $4 billion and enlists Rocket Lab and SpaceX for commercial landers.",
    cover_image_url: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1200&h=675&fit=crop',
    cover_image_alt: 'Mars surface',
    cover_image_credit: 'NASA/JPL',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['nasa', 'mars', 'sample-return', 'rocket-lab', 'spacex'],
    source_urls: [],
    reading_time_min: 4,
    published_at: daysAgo(2),
    created_at: daysAgo(2),
  },
  {
    id: '7',
    slug: 'cislunar-economy-2026-report',
    title: 'The Cislunar Economy Hit $12 Billion in 2025',
    subtitle: 'Government contracts still dominate, but commercial revenue crossed the $2 billion threshold for the first time.',
    section: 'economy',
    body_md: `The combined cislunar economy reached $12 billion in total transaction value during 2025, according to a new report from the Space Foundation. Commercial revenue accounted for $2.1 billion of that total, crossing the billion-dollar threshold for the first time.

## Key Findings

Government contracts, primarily from NASA, the European Space Agency, and CNSA, still account for 82% of cislunar economic activity. The remaining 18% comes from commercial sources including space tourism, in-orbit manufacturing, and satellite servicing.

The fastest-growing segment was in-orbit manufacturing, which grew 340% year-over-year driven largely by pharmaceutical and semiconductor crystal growth experiments aboard the ISS and Axiom Station.

## Breakdown by Segment

Transportation services (launch) accounted for 45% of the total market. Station operations and services made up 28%. Surface activities, primarily robotic missions and ISRU technology development, represented 15%. The remaining 12% fell under insurance, finance, and professional services.

## Looking Ahead

The report projects the cislunar economy will reach $25 billion by 2030, driven by commercial space station operations, lunar surface activities under Artemis, and the maturation of in-orbit manufacturing for terrestrial markets.`,
    excerpt: "The cislunar economy reached $12 billion in 2025, with commercial revenue topping $2 billion for the first time.",
    cover_image_url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&h=675&fit=crop',
    cover_image_alt: 'Earth and moon',
    cover_image_credit: 'NASA',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['cislunar', 'economy', 'space-economy', 'report'],
    source_urls: [],
    reading_time_min: 4,
    published_at: daysAgo(2),
    created_at: daysAgo(2),
  },
  {
    id: '8',
    slug: 'blue-origin-new-glenn-second-flight',
    title: "Blue Origin's New Glenn Flies Again, Nails Booster Landing",
    subtitle: 'The second flight achieves all mission objectives including first-stage recovery on a marine platform.',
    section: 'rockets',
    body_md: `Blue Origin's New Glenn rocket completed its second flight Tuesday, successfully delivering two telecommunications satellites to geostationary transfer orbit and landing its first-stage booster on a drone ship in the Atlantic Ocean.

## The Mission

New Glenn lifted off from Launch Complex 36 at Cape Canaveral at 2:18 AM ET. The first stage separated at T+3 minutes and executed a series of boostback and landing burns before touching down on the marine landing platform "Jacklyn" approximately 8 minutes after launch.

The second stage continued to GTO, deploying two satellites for a commercial customer approximately 45 minutes after launch.

## Why the Landing Matters

Blue Origin's first New Glenn flight in January achieved orbit but lost the booster during its landing attempt. Recovering the booster on the second try demonstrates rapid learning and positions New Glenn as a credible competitor to SpaceX's Falcon 9 in the commercial launch market.

## Commercial Implications

New Glenn's 45-metric-ton LEO payload capacity fills a gap between Falcon 9 and Starship. Several commercial customers have manifested payloads on upcoming flights, including Amazon's Project Kuiper constellation.`,
    excerpt: "New Glenn's second flight sticks the booster landing, establishing Blue Origin as a reusable launch competitor.",
    cover_image_url: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?w=1200&h=675&fit=crop',
    cover_image_alt: 'Rocket launch',
    cover_image_credit: 'Blue Origin',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['blue-origin', 'new-glenn', 'launch', 'reusable'],
    source_urls: [],
    reading_time_min: 3,
    published_at: daysAgo(3),
    created_at: daysAgo(3),
  },
  {
    id: '9',
    slug: 'space-forge-returns-first-samples',
    title: 'Space Forge Returns First Manufactured Samples to Earth',
    subtitle: 'The Welsh startup retrieved semiconductor wafers grown in microgravity aboard its ForgeStar vehicle.',
    section: 'tech',
    body_md: `Space Forge, a Cardiff-based in-space manufacturing company, successfully returned its ForgeStar-2 vehicle to Earth carrying semiconductor crystal samples grown in microgravity.

## The Mission

ForgeStar-2 spent 45 days in low Earth orbit, during which automated systems grew gallium arsenide crystal wafers in a microgravity environment. The vehicle reentered the atmosphere and was recovered via parachute in the Australian outback.

## Why Microgravity Manufacturing Matters

Semiconductor crystals grown in microgravity have fewer defects than those produced on Earth. Gravity causes density-driven convection during crystal growth, introducing impurities and structural flaws. In microgravity, crystals grow more uniformly.

Space Forge claims its microgravity-grown wafers show a 30% improvement in electron mobility compared to terrestrial equivalents, which could translate to meaningful performance gains in high-frequency electronics and photovoltaics.

## Market Potential

The company has pre-orders from three undisclosed semiconductor firms. If the quality improvements hold across larger production runs, Space Forge projects annual revenue exceeding $100 million by 2030 from space-manufactured semiconductors alone.`,
    excerpt: "Space Forge retrieves microgravity-grown semiconductor wafers, demonstrating commercial in-space manufacturing viability.",
    cover_image_url: 'https://images.unsplash.com/photo-1516849677043-ef67c9557e16?w=1200&h=675&fit=crop',
    cover_image_alt: 'Technology manufacturing',
    cover_image_credit: 'Space Forge',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['space-forge', 'manufacturing', 'semiconductors', 'microgravity'],
    source_urls: [],
    reading_time_min: 3,
    published_at: daysAgo(3),
    created_at: daysAgo(3),
  },
  {
    id: '10',
    slug: 'china-lunar-research-station-update',
    title: "China Reveals Timeline for International Lunar Research Station",
    subtitle: 'Phase 1 construction begins in 2028 with three robotic missions, crewed operations targeted for 2032.',
    section: 'moon',
    body_md: `China's National Space Administration released an updated timeline and architecture plan for the International Lunar Research Station (ILRS), confirming Phase 1 construction will begin in 2028.

## The Plan

Phase 1 (2028-2030) involves three robotic missions that will deliver core infrastructure: a power station, communications relay, and initial habitat module. These will land near the lunar south pole in the Aitken Basin region.

Phase 2 (2030-2032) adds a research laboratory, resource processing facility, and expanded living quarters. Crewed missions begin in Phase 2 using China's next-generation crew vehicle.

Phase 3 (2032-2035) scales the station to accommodate rotating crews of 4-6 and begins regular ISRU operations.

## International Partners

Russia, Pakistan, Egypt, and several other nations have signed cooperation agreements. Notably absent are ESA member states and Japan, both of which are committed to NASA's Artemis program.

## Competitive Dynamics

The ILRS timeline runs roughly parallel to NASA's Artemis Base Camp plans. The two programs represent competing visions for permanent lunar presence, with different approaches to international cooperation, commercial involvement, and technology sharing.`,
    excerpt: "CNSA confirms 2028 start for the International Lunar Research Station, with crewed operations beginning by 2032.",
    cover_image_url: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1200&h=675&fit=crop',
    cover_image_alt: 'Moon close-up',
    cover_image_credit: 'NASA',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['china', 'ilrs', 'lunar-base', 'cnsa'],
    source_urls: [],
    reading_time_min: 4,
    published_at: daysAgo(4),
    created_at: daysAgo(4),
  },
  {
    id: '11',
    slug: 'spacex-profile',
    title: 'SpaceX: The Company That Made Reusability Real',
    subtitle: 'How a startup with three failed launches became the most prolific launch provider in history.',
    section: 'players',
    body_md: `SpaceX, founded in 2002 by Elon Musk, has fundamentally altered the economics and cadence of space launch. The company conducted over 100 orbital missions in 2025 alone.

## Key Programs

**Falcon 9** remains the workhorse. With over 300 flights and a 99.5% success rate, it is the most-flown orbital rocket in history. Individual boosters have flown more than 25 times.

**Starship** is the fully reusable next-generation vehicle designed for lunar landing, Mars colonization, and point-to-point Earth transport. The vehicle's payload capacity of 150+ metric tons to LEO is unmatched.

**Starlink** is SpaceX's satellite internet constellation, now serving over 4 million subscribers across 80 countries. Revenue from Starlink is estimated to exceed $8 billion annually, funding Starship development.

## Mars Architecture

SpaceX's stated goal remains establishing a self-sustaining city on Mars. The current plan involves Starship convoys carrying cargo to Mars during every synodic window (approximately every 26 months), with the first uncrewed cargo missions targeted for the late 2020s.

## Valuation and Position

SpaceX is the most valuable private company in the world at approximately $350 billion. It holds NASA contracts for lunar landing (HLS), crew transport (Commercial Crew), and cargo resupply.`,
    excerpt: "A profile of SpaceX, from three failed launches to the world's most prolific launch provider and Mars ambitions.",
    cover_image_url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=1200&h=675&fit=crop',
    cover_image_alt: 'SpaceX Falcon 9 on pad',
    cover_image_credit: 'SpaceX',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['spacex', 'falcon-9', 'starship', 'starlink', 'profile'],
    source_urls: [],
    reading_time_min: 4,
    published_at: daysAgo(5),
    created_at: daysAgo(5),
  },
  {
    id: '12',
    slug: 'space-hotel-tracker-2026',
    title: 'Every Space Hotel Project Announced So Far',
    subtitle: 'A tracker of all announced orbital hospitality ventures, from conceptual to under construction.',
    section: 'orbit',
    body_md: `The space hotel concept has moved from science fiction to funded engineering programs. Here is the current state of every announced orbital hospitality project.

## Under Construction

**Axiom Station** (Axiom Space) is the furthest along. Modules are being built and attached to the ISS, with the first private crew missions already completed. Full station detachment and independent operations are planned for 2028-2029.

**Haven-1** (Vast) is a single-module station designed for stays of up to 30 days. Currently under construction in Long Beach, California, with a planned launch on Falcon 9 in 2026.

## In Development

**Orbital Reef** (Blue Origin + Sierra Space) received NASA CLD funding but has experienced schedule delays. The station concept features a mixed-use architecture supporting research, tourism, and manufacturing.

**Starlab** (Voyager Space + Airbus) is another NASA CLD-funded station targeting 2028 operations.

## Conceptual

**Pioneer Station** (Orbital Assembly) proposes a rotating station generating partial gravity through centripetal force. The concept is ambitious but faces significant engineering and funding hurdles.

## The Market

Current pricing for orbital stays ranges from $25 million to $55 million per person for missions of 10-14 days. As commercial station capacity increases, prices are expected to decrease, potentially reaching $5-10 million per seat by 2032.`,
    excerpt: "A comprehensive tracker of every announced space hotel and orbital hospitality project, from under construction to conceptual.",
    cover_image_url: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1200&h=675&fit=crop',
    cover_image_alt: 'Space station concept',
    cover_image_credit: 'NASA',
    author: 'Colonizer Staff',
    status: 'published',
    tags: ['space-hotel', 'axiom', 'vast', 'orbital-reef', 'tourism'],
    source_urls: [],
    reading_time_min: 5,
    published_at: daysAgo(6),
    created_at: daysAgo(6),
  },
]
