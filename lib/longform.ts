// Long-form SEO copy restored from the pre-cutover WordPress site (Wayback
// snapshots, see work/recovered-copy/). Edited for AU English and accuracy —
// substance and keyword structure preserved per page. Each record is unique
// to its URL: 3d-lettering, 3d-signs and illuminated-signs share a service
// template but must never share prose.

export type ContentSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type LongFormContent = {
  eyebrow?: string;
  title: string;
  sections: ContentSection[];
  related?: { label: string; href: string }[];
};

export const platinumDifference = {
  eyebrow: "The Platinum Difference",
  title: "5-star signage solutions for all of Sydney.",
  items: [
    {
      name: "Fast turnaround",
      desc: "We pride ourselves on achieving realistic deadlines for our customers' projects.",
    },
    {
      name: "Nationwide installation",
      desc: "A network of sign installers across Australia lets us carry out projects in all major cities — Sydney, Melbourne, Canberra, Brisbane, Perth and everywhere in between.",
    },
    {
      name: "Advice & consultation",
      desc: "No bots, no automation — an expert account manager discusses your needs directly.",
    },
    {
      name: "Design creation",
      desc: "Our design team manually verifies and proofs artwork files. Our signage workflow is built to minimise errors.",
    },
    {
      name: "Print, cut & finish",
      desc: "In-house cutting, printing and finishing let us control quality and lead times, keeping our service consistent.",
    },
  ],
};

export const homeLongform: LongFormContent = {
  eyebrow: "Australia's signage expert",
  title: "Light and three dimensions, one project at a time.",
  sections: [
    {
      heading: "Australia's signage expert",
      paragraphs: [
        "Modern signage technology brings light and three dimensions to today's signs. From 3D signs to illuminated lightbox signage to modern LED neon, 3D Illuminated Signs aims to be the best sign company in Australia, one project at a time. From idea to installation, our sign team provides quick turnaround on all sign projects — we deliver signage of all shapes and sizes, and we like to push the boundaries to ensure brands flourish in their physical form.",
        "If you're looking for the best 3D, LED or illuminated signs in Sydney — or Melbourne, Brisbane, or anywhere in Australia — all signs point to 3D Illuminated Signs. Call our signwriters today on 1300 448 608 to find out how light and three dimensions can make your business shine.",
      ],
    },
    {
      heading: "We install your sign at your location — Sydney-wide",
      paragraphs: [
        "Creating best-in-class signage is our first priority. After that, our signage installation team does the job right on site. Platinum Signs takes safe workplaces seriously: we install all types of signs and provide a safe work environment for our employees and contractors, even on jobs many companies won't take on.",
      ],
    },
    {
      heading: "Design, create, manufacture",
      paragraphs: [
        "Need help with your artwork? Our dedicated sign design team brings your signage ideas to life. From a simple printed acrylic panel to full wall graphic displays, we guide you toward the best outcome for your project, suggest the best methods and materials, and share the secrets of signage that create the effect you're after.",
      ],
    },
    {
      heading: "LED signs",
      paragraphs: [
        "LED signs let you make a visual statement that beautifully represents your company's individuality. We provide LED sign solutions across all major cities of Australia. LED technology saves energy and provides flexibility — even today's neon signs use LED technology.",
      ],
    },
    {
      heading: "Office signage",
      paragraphs: [
        "Today's Sydney businesses are more often offices than factories or warehouses — and smart businesses look for a best-in-class office signage vendor not just in Sydney, Melbourne or Canberra but throughout Australia. Office signage is what we do best, from simpler solutions like manifestation strips for glass partitions to beautiful, striking LED signs for reception areas — and incredible neon signage made right here in Sydney.",
      ],
    },
    {
      heading: "Illuminated signs",
      paragraphs: [
        "Light is the key technology behind modern signage — backlit signs, cabinet signs, LED signs and the new LED neon formats. Our designers and artisans fabricate illuminated signs to your exact specifications and install them anywhere in Australia. Illuminated signs work in darkness and daylight, advertise your business at all times, and — because people are naturally drawn to lit signage — make your business stand out. Low-maintenance and low-voltage, they transform your logo into an absolute showstopper.",
      ],
    },
    {
      heading: "3D signs",
      paragraphs: [
        "Humans live in three dimensions, not two — so 3D signage is the natural way to make signs. 3D signs often rely on light, and as lightboxes or other multi-dimensional formats they bring attention straight to your business. 3D lettering and signage can be produced from a wide variety of materials, durable enough for many years of use. Our experts can walk you through every option and what will work best for your brand.",
      ],
    },
    {
      heading: "Lightbox signs",
      paragraphs: [
        "The design and manufacture of custom lightboxes is one of our specialties. Lightbox signs install inside and outside most buildings and are manufactured in our Australian workshop to the highest quality — internal lighting fully installed, aluminium and steel body, with panels in acrylic, polycarbonate or flex-face banner, printed with any design or text of your choice. Built to your measurements; the size you choose is generally limited only by budget.",
      ],
    },
  ],
  related: [
    { label: "3D Lettering", href: "/3d-lettering/" },
    { label: "3D Signs", href: "/3d-signs/" },
    { label: "Illuminated Signs", href: "/illuminated-signs/" },
    { label: "LED Signs", href: "/led-signs/" },
    { label: "Lightbox Signs", href: "/lightbox-signs/" },
    { label: "Neon Signs", href: "/neon-signs/" },
    { label: "Acrylic Signs", href: "/acrylic-signs/" },
    { label: "Reception Signs", href: "/reception-signs/" },
    { label: "Office Signage", href: "/signage-in-office/" },
  ],
};

export const longformContent: Record<string, LongFormContent> = {
  "3d-lettering": {
    eyebrow: "In depth",
    title: "3D lettering, explained.",
    sections: [
      {
        heading: "Made to stand out",
        paragraphs: [
          "3D lettering is the key to making your business stand out in the crowded landscape of Sydney, Melbourne and Canberra. Australian consumers are busy, and you need to catch their eye. That is why we focus specifically on being a top-rated 3D lettering company right here in Sydney, NSW — servicing Melbourne, Canberra and the rest of the country with the same 3D signage services.",
          "Our experts offer design, manufacturing and installation for 3D lettering and 3D signage, and we support businesses in using dimensional lettering to build brand awareness. Signs can be designed and installed in all kinds of locations, and we are mindful of local council regulations — our team can assist in applying for any permits required.",
        ],
      },
      {
        heading: "Custom-made in our Sydney workshop",
        paragraphs: [
          "We custom-make our signs to fit your business. Sydney, Melbourne and Canberra are competitive environments, and if your signs look like everyone else's, you won't garner attention. Our sign writers work with you to convey your brand message and produce 3D lettering that is unique to each client — during design, we show you examples of how your sign will appear in three dimensions.",
          "Letters are produced in our workshop on machinery fitted for dimensional sign work. Once your design is finalised, our Sydney-based team keeps you updated as the sign moves through manufacturing. From there, our installation team can deliver and install the finished letters — or, if you would rather install them yourself, most 3D letters are supplied with backing tape and easy-to-follow instructions. More complex installations are best handled by a qualified sign installation team.",
        ],
      },
      {
        heading: "Common materials for 3D letters",
        bullets: [
          "Stainless steel — perfect for reception and outdoor signage.",
          "Acrylic — laser cut for the best precision.",
          "Aluminium — lightweight and ideal for hard-to-reach positions.",
          "Polystyrene — lightweight and paintable; coated in urethane for outdoor protection and longevity.",
        ],
      },
      {
        heading: "What is 3D lettering?",
        paragraphs: [
          "3D fabricated sign letters are customised to fit your business brand. There is more to great dimensional signage than arranging letters in the correct order: they need the right style and tone for your business, and they can be made in your exact brand colours. We work with you through the whole process — design, manufacturing and installation. Among the 3D fabricated signs we produce:",
        ],
        bullets: [
          "Stainless steel letters",
          "Fabricated LED letters",
          "Complete signage design and installation",
          "3D illuminated letters",
          "Brass, copper and aluminium letters",
          "Illuminated signage",
        ],
      },
      {
        heading: "3D laser-cut letters with 2-pac finish",
        paragraphs: [
          "If you supply your font or logo, we cut your letters on our laser cutters from acrylic or aluminium. After cutting, the letters are painted with quality 2-pac paint in a PMS colour of your choice. These letters install on flat surfaces; for larger signs we attach pins to be embedded into the wall. PMS colour matching keeps your brand colours exact, and 2-pac paint is highly durable, giving the sign a perfect finish.",
        ],
      },
      {
        heading: "Stainless steel and aluminium letters on pins",
        paragraphs: [
          "Stainless steel and aluminium letters are versatile — they can be painted, anodised or electroplated to suit your design, and work for internal and external applications. All metal letters are laser cut for precision, with pins welded to the back. The pins hold the letter off the mounting surface and are embedded into the wall and secured with epoxy.",
        ],
      },
      {
        heading: "Intracut signs",
        paragraphs: [
          "An intracut sign is cut with our precision router from a 6–25mm opal acrylic sheet. We then apply cast vinyl (for solid colours) or digitally printed media (for logos) to the face of the letters. The letters are pushed through a negative cut and illuminated from the rear. These signs are ideal for retail, building exteriors, reception areas and offices.",
        ],
      },
      {
        heading: "Channel letters with halo LED illumination",
        paragraphs: [
          "Channel letters can be produced in a variety of colours using RGB LEDs. The letter body is fabricated from aluminium and acrylic, with a clear-opal rear panel that diffuses light to create the halo effect. Mounting depends on the installation site; because each unit is sealed against weather and insects, halo-lit channel letters are well suited to outdoor use.",
        ],
      },
      {
        heading: "25mm plexiglass 3D letters",
        paragraphs: [
          "Used primarily for wall-mounted or frame-suspended signs, 25mm plexiglass letters work internally and externally. Each letter is routed to your specification, with a rear channel illuminated by mini-LEDs.",
        ],
      },
    ],
    related: [
      { label: "3D Signs", href: "/3d-signs/" },
      { label: "Illuminated Signs", href: "/illuminated-signs/" },
      { label: "Reception Signs", href: "/reception-signs/" },
      { label: "Signage Installation", href: "/signage-installation/" },
    ],
  },

  "3d-signs": {
    eyebrow: "In depth",
    title: "Why 3D signs work.",
    sections: [
      {
        heading: "Three dimensions get attention",
        paragraphs: [
          "“3D” stands for three-dimensional — signs with real depth and proportion. Our sign writers love 3D signage because dimensional signs, especially illuminated ones, make brands go WOW here in Sydney. 3D signage often relies on light: as lightbox signs or other multi-dimensional formats, they draw attention straight to your business. 3D signs can be produced from a wide variety of materials and are durable enough to last many years of use.",
          "With 3D signs you have plenty of options for adding light — shadows, halo lighting or internal illumination. Each effect helps make your signage noteworthy and pushes your brand to the front. Signs are part of your brand: the better they look, the better your business appears. Our 3D sign company is based in Sydney, but we work across all of Australia, from Sydney to Melbourne, Brisbane to Canberra, and everywhere in between.",
        ],
      },
      {
        heading: "3D signs and cut-out letters",
        paragraphs: [
          "3D Illuminated Signs has been making 3D signs for Australian businesses for many years, and we know how to make signs that stand out. A 3D sign is an excellent choice for your main exterior signage, and adding illumination keeps it visible around the clock. To get started with a free quote, call our design team on 1300 448 608.",
        ],
      },
      {
        heading: "New signs renew your business brand",
        paragraphs: [
          "Installing new signage shows existing and potential customers that yours is a forward-looking business. Old, decrepit signage does the opposite — it suggests there is not much faith in the business, and that turns people away. We can review your current signage and provide a plan for improving it.",
        ],
      },
      {
        heading: "Why choose us for your sign needs?",
        bullets: [
          "We produce signs to your needs and custom dimensions",
          "You work directly with our designers and sign makers",
          "High-quality signs built to last",
          "Prices competitive with the current market",
          "Quality before- and after-sales service",
          "Fast results on all new signs",
          "We meet all Australian safety standards",
          "Installs completed at a time that suits your business",
          "We design and install signs Australia-wide",
          "Highly trained designers using the latest machinery",
        ],
      },
      {
        heading: "3D signs stand out",
        paragraphs: [
          "Our design team has the skills to design, manufacture and install signs for all sorts of purposes. Whether you want to increase brand awareness or need something unique to draw customers in, we can craft the perfect sign — we think outside the box and deliver truly unique 3D signs that give your business a focal point.",
          "Every 3D sign is made with a specific purpose in mind. All our signs are designed for marketing, built to whatever shape or size you have in mind, and produced to withstand the elements — including the harsh Australian climate. For a dimensional sign with illumination and bold colours made from high-quality materials, you can rely on the team at 3D Illuminated Signs.",
          "The materials used in your 3D sign depend on where it will be installed and any council regulations that apply. Using the best available materials leaves you with a long-lasting sign that keeps showcasing your business year after year.",
        ],
      },
    ],
    related: [
      { label: "3D Lettering", href: "/3d-lettering/" },
      { label: "Illuminated Signs", href: "/illuminated-signs/" },
      { label: "LED Signs", href: "/led-signs/" },
      { label: "Lightbox Signs", href: "/lightbox-signs/" },
    ],
  },

  "illuminated-signs": {
    eyebrow: "In depth",
    title: "Bring your brand to the light.",
    sections: [
      {
        heading: "Why illuminated signage",
        paragraphs: [
          "Illuminated signs are one of the best ways to showcase your brand to the world. Light is key to contemporary signage — backlit signs, cabinet signs, LED signs and the newer LED neon formats all use it. Our team of sign designers and artisans is ready to work on your brand and bring your vision to the light, fabricating illuminated signs to your exact specifications and installing them anywhere in Australia.",
          "Illuminated signs work in every kind of light — daylight, dusk or the dispersed glow of Sydney at night. They advertise your business at all hours, and because people are naturally drawn to lit signage, your business stands out. Our illuminated signs are low-maintenance and low-voltage, and they can transform a logo into an absolute showstopper. They are produced to match your existing brand colours and style, in built-up letters, raised lettering, projecting signs and many other formats.",
        ],
      },
      {
        heading: "Which industries suit illuminated signs?",
        paragraphs: [
          "Illuminated signs are ideal for many businesses. We have produced them for government agencies, corporate events, and small and medium businesses across Sydney, Melbourne and Canberra. In any space where you need to pass on a message, we can manufacture a suitable sign — as a fresh look for an existing business, or the starting point of a complete rebrand.",
          "Backlit signs, 3D signs and LED signs all feel fresh and modern, and they highlight your business or event day and night. The right style reflects your brand: are you after modern appeal, or is your business steeped in tradition? Our designers will find the sign that suits.",
        ],
      },
      {
        heading: "How long does illuminated signage take to manufacture?",
        paragraphs: [
          "Every illuminated sign is custom-produced to a particular brief, so the timeframe depends on complexity. Once your design is approved, we confirm a manufacturing and installation programme for your project.",
        ],
      },
      {
        heading: "Design services for illuminated signage",
        paragraphs: [
          "Our Sydney design team can help at any stage. If you have an existing brand identity kit — font, colours, logo — your design can be finished quickly; often we only need the words for your sign. If you are after a unique sign designed expressly for your business, our qualified designers will help make your illuminated signage the best in your category.",
        ],
      },
    ],
    related: [
      { label: "LED Signs", href: "/led-signs/" },
      { label: "Neon Signs", href: "/neon-signs/" },
      { label: "Lightbox Signs", href: "/lightbox-signs/" },
      { label: "Sign Design Service", href: "/design-service/" },
    ],
  },

  "acrylic-signs": {
    eyebrow: "In depth",
    title: "Acrylic signage, in depth.",
    sections: [
      {
        heading: "Why acrylic",
        paragraphs: [
          "Acrylic is commonly used in place of glass in the signage industry. It is highly durable and versatile, yet offers excellent transparency. Acrylic is ideal for large-format printing: its smooth surface carries vivid imagery, precise colour matching and etching. Combine custom-crafted acrylic signs with backlighting or spotlights and the results are truly unique.",
          "Based in Sydney, 3D Illuminated Signs can design acrylic signs for installation anywhere in Australia. Acrylic signage is highly customisable, and we can help you decide which options suit your business best — from professional commercial spaces to promotional interiors and short-term event branding.",
        ],
      },
      {
        heading: "Lightweight and durable",
        paragraphs: [
          "Acrylic is preferred over glass, which is comparatively fragile. Its smooth surface prints clearly and legibly, and custom-printed acrylic signs hold up against all forms of weather, making them suitable inside and out. Transport is easy too — acrylic generally will not shatter or break if dropped, which makes it brilliant for pop-up promotions, stalls and other mobile events.",
        ],
      },
      {
        heading: "Applications for acrylic signage",
        bullets: [
          "Reception panels and 3D reception lettering",
          "Promotional acrylic boards",
          "Nameplates and room-number signs",
          "Architectural and building signage",
          "Point-of-sale displays",
          "Custom 3D signage",
          "Statutory and braille signs",
          "Lightboxes",
          "Frosted and corporate acrylic prints",
          "Coasters, artistic panels and special projects",
        ],
      },
      {
        heading: "Panel and print options",
        paragraphs: [
          "Coloured acrylic printed panels — printing is applied to the front face of the sign. Because it sits on the visible surface it can be prone to scratching, so we include a matte or gloss laminate for protection.",
          "Transparent acrylic panels, printed from the back (our most popular option) — back-printing produces a uniform, glossy finish, protects the ink from scratches and gives the print a stunning sense of depth.",
          "Opal (translucent) acrylic — used widely for internal and external lightboxes and any project that needs light to shine through. Depending on the job we print directly or apply translucent film.",
        ],
      },
      {
        heading: "Custom acrylic signs",
        paragraphs: [
          "Custom signs are our speciality. Many Sydney businesses use acrylic signage for promotion or information displays — the applications are nearly endless. People often hear “custom” and think “expensive”, but with acrylic and modern production technology, personalised signage is genuinely affordable. It is ideal for a start-up wanting a professional touch, or an established business seeking a durable solution while keeping costs down.",
        ],
      },
      {
        heading: "Sheet sizes, thicknesses and colours",
        paragraphs: [
          "Acrylic thickness ranges from 2mm to 40mm. For large flat-panel printing, 3mm and 4.5mm are the most popular; 10mm and 20mm boards are common for reception acrylic and 3D cut lettering. Full standard sheets are 1220mm × 2440mm, and for custom projects we can work with panels up to 3000mm long — while some unique jobs use prints as small as 50mm × 50mm.",
          "Black and white panels are the most popular, and we work with a full colour range — blue, yellow, red, green and grey, plus special panels like gold, metallic, frosted, matte and fluorescent. Cast opal acrylic is the right choice when light needs to shine through, for lightboxes and 3D illuminated signs — one of our strongest products.",
        ],
      },
      {
        heading: "Precision cutting",
        paragraphs: [
          "Computer-assisted laser and router cutting is one of our strongest points — from simple geometric shapes and rounded panels to intricate cuts for architectural projects, point-of-sale displays and 3D acrylic signs. Laser-cut panels come off the machine with polished edges; router-cut panels do not, and we finish them as the job requires.",
        ],
      },
      {
        heading: "Can acrylic be used outdoors?",
        paragraphs: [
          "Acrylic is a sturdy, waterproof material that can be installed outside. Cut-out lettering presents no problems, and under-awning acrylic lightboxes are fine too. We do not recommend acrylic for large flat panels fully exposed to the sun long-term — for those, ACM (aluminium composite panel) is the better choice. Every signage project is unique; contact our design team and we will advise whether acrylic or Perspex suits yours.",
        ],
      },
      {
        heading: "High-impact signage that wows",
        paragraphs: [
          "With competition as challenging as it gets, attracting attention toward your business improves your sales. Acrylic signs are eye-catching, and because we manufacture to any shape, size and colour, each sign is developed specifically for your business. With glass-like transparency, they present text and imagery — your logo, your branding — extremely well, and suit everything from desk nameplates to full wayfinding for your workspace.",
          "Custom acrylic signs work for all types of businesses: retail, corporate offices, bars, hotels, restaurants, pop-up stores, market stalls and more. The biggest benefits are lower cost, customisation and durability. Custom acrylic signs are available in Sydney, Melbourne and Canberra, and throughout Australia when we work with a national brand.",
        ],
      },
    ],
    related: [
      { label: "Reception Signs", href: "/reception-signs/" },
      { label: "Lightbox Signs", href: "/lightbox-signs/" },
      { label: "3D Lettering", href: "/3d-lettering/" },
      { label: "Artwork Specifications", href: "/artwork-specifications/" },
    ],
  },

  "led-signs": {
    eyebrow: "In depth",
    title: "LED signage that lasts — and saves money.",
    sections: [
      {
        heading: "The energy-efficient way to stand out",
        paragraphs: [
          "To get your business out in front of the crowd, you can rely on LED signage from 3D Illuminated Signs. We are proud to offer LED signage in Sydney, Melbourne, Canberra and throughout Australia — and because LED is energy-efficient, it saves you money while it works.",
          "LED signs can be produced from a wide variety of materials and are durable enough to last many years. With LED you have plenty of illumination options — shadows, halo lighting or internal lighting — each helping your brand stand out to your customers. The better your signs look, the more professional your business appears.",
        ],
      },
      {
        heading: "LED signs work for many industries",
        paragraphs: [
          "Industry after industry has discovered LED signage. Our designers work with government organisations, retail and small business, plus corporate and events clients who want the latest in signage. Illuminated signs and lightbox signage give a fresh, modern feel to any space. With your dimensions and design requirements in hand, we can use face-lit letters, halo lighting, front-lit formats, LED neon or a combination to bring your brand to life.",
          "Day or night, give your shop, café, office or event a glow with bespoke LED signs. Choose a warm splash of colour or a cooler feel — LED signs are a low-voltage, low-maintenance option that turns logos into showstoppers.",
        ],
      },
      {
        heading: "We lead Australia in LED signage",
        bullets: [
          "LED and 3D signs produced to your needs and custom dimensions",
          "Work directly with our designers and sign makers",
          "High-quality signs built to last",
          "Prices competitive with the current market",
          "Quality before- and after-sales service",
          "Fast results for all new signs",
          "All Australian safety standards met",
          "Installs at a time that suits your business",
          "Design and installation Australia-wide",
          "Highly trained designers and the latest machinery",
        ],
      },
      {
        heading: "Working with designers, architects and other sign companies",
        paragraphs: [
          "Our design team works with agencies across Australia, independent designers, architectural firms and interior design companies. Sometimes we collaborate with their designers; other times clients need full assistance with consultation and concept creation. We also partner with other signage companies — supplying anything from acrylic 3D signs to lightboxes and metal 3D signs for providers who do not have the equipment, space or time to produce illuminated signs — and with fit-out companies, whether they install with their own trades or use ours.",
        ],
      },
      {
        heading: "Materials and pricing",
        paragraphs: [
          "Prices for 3D illuminated signs vary greatly with the design specification and material — from cost-effective foam board, acrylic and MDF through to elaborate cut-metal signage and LED neon. The price depends on fabrication time and the chosen material; we work with a large range and give honest, realistic price expectations from the start.",
        ],
      },
      {
        heading: "Our process and turnaround",
        paragraphs: [
          "It starts with a consultation — over the phone, at your premises, or at our Sydney workshop. We discuss materials, budget, and what can be achieved within any design or building limitations. Then comes the mock-up phase; once approved, the sign goes to production. You can usually expect a 2–4 week turnaround depending on complexity and quantity. The final stage is installation by our professional signwriters, or we can organise delivery for your team to handle.",
        ],
      },
    ],
    related: [
      { label: "Illuminated Signs", href: "/illuminated-signs/" },
      { label: "Neon Signs", href: "/neon-signs/" },
      { label: "Lightbox Signs", href: "/lightbox-signs/" },
      { label: "Signage Installation", href: "/signage-installation/" },
    ],
  },

  "lightbox-signs": {
    eyebrow: "In depth",
    title: "Custom lightboxes, built in Australia.",
    sections: [
      {
        heading: "A specialty of ours",
        paragraphs: [
          "The design and manufacture of custom lightboxes is one of our specialties. Lightbox signs have many uses in business and can be installed inside and outside most buildings. We manufacture in our Australian workshop from the best-quality materials: internal lighting fully installed, an aluminium and steel body (unless noted), and panels in acrylic, polycarbonate or flex-face banner. Any design or text can be printed on the panel, built to your exact measurements — size is generally limited only by budget.",
          "Most of the lightboxes we produce use advanced LED technology as the light source. LEDs last longer, produce no noxious gases, cost less to run and reduce environmental impact. Use traditional lettering or add 3D lettering for an extremely professional look.",
        ],
      },
      {
        heading: "Why use lightbox signage?",
        paragraphs: [
          "With fierce competition in Sydney, you want every possible advantage. A lightbox is visible at night, advertising your business at all hours — and a double-sided lightbox is equally visible from both directions. Light attracts people; it is why advertising lights fill every major city.",
          "Many customers decide what they think of your business before you ever get to talk to them. A professional sign breaks that first barrier: it says you care about your business, makes you easy to find, and tells people what you can do. Signs are informational, and they build your brand.",
        ],
      },
      {
        heading: "A lightbox checklist",
        bullets: [
          "Look at your business from all angles — where are your current signs visible from, and how would they look with light added?",
          "Review your business at night. Where would a lightbox perform best?",
          "Is your current logo modern, or due for a refresh? If you plan to update your logo, do it before ordering the lightbox.",
          "Consider professional design input for the lightbox itself to get maximum value from the sign.",
        ],
      },
      {
        heading: "Why choose us for lightbox signs?",
        paragraphs: [
          "3D Illuminated Signs is a leader in the signage industry, with the right tools, equipment and experience to get the job done properly. We offer a complete solution and work with you through the entire process, from initial design to installation. When you work with us, you are never left in the dark.",
        ],
      },
      {
        heading: "Sizes, builds and lighting",
        paragraphs: [
          "Our lightboxes are available in many sizes — prebuilt standard sizing and special-order custom builds with varied shapes, branding, colouration and lighting options. All boxes are built from premium products including powder-coated aluminium and stainless steel, and we recommend LED lighting as the most cost-effective way to keep your signage bright.",
        ],
        bullets: [
          "Multiple sizes",
          "Light panels",
          "Wide-screen formats",
          "Custom design",
          "Lightweight boxes",
          "Long-lasting LED lighting",
        ],
      },
      {
        heading: "Lightbox signs build your brand",
        paragraphs: [
          "Sydney is a competitive environment, and getting your customers' attention is part of the contest. A lightbox as part of your signage strategy is an excellent investment — and we handle all of it: design, panel fabrication, and installation in your preferred position.",
        ],
      },
    ],
    related: [
      { label: "LED Signs", href: "/led-signs/" },
      { label: "Illuminated Signs", href: "/illuminated-signs/" },
      { label: "Acrylic Signs", href: "/acrylic-signs/" },
      { label: "3D Signs", href: "/3d-signs/" },
    ],
  },

  "neon-signs": {
    eyebrow: "In depth",
    title: "Neon, reinvented with LED.",
    sections: [
      {
        heading: "The new neon",
        paragraphs: [
          "Neon signs — now based on LED technology — have become the leading choice in Sydney. Traditional glass neon looks nice, but it is outdated for good reasons: today's LED neon signs are cheaper to produce, last longer without ongoing maintenance, use far less electricity, and are much safer to deploy because they run on very low voltage. A huge range of colours is available, along with easy-to-install fitting systems on pre-drilled mounted panels.",
          "Neon signage is found throughout Sydney: interior design for bars, restaurants, fitness and beauty studios, architectural projects, branding, pop-up stores, events and exhibitions, art, retail and corporate applications. It is also hugely popular as pop art in homes and offices, and sought after for birthdays and weddings. Our neon specialists work in Sydney, Melbourne and Canberra.",
        ],
      },
      {
        heading: "Custom neon using LED technology",
        paragraphs: [
          "We design custom neon signs using energy-saving LED technology — or, if you have designed something yourself, simply email your logo as a vector file or graphic artwork and our team will transform it into production files. LED neon does have some shape limitations, which is where flex neon comes in: with 180° or 360° flex the range of achievable shapes is much wider (the signs do get pricier), or the design can be simplified slightly to suit the standard format.",
        ],
      },
      {
        heading: "Mounting options",
        paragraphs: [
          "LED neon mounts on acrylic panels in a range of colours — clear, white and black are the most popular. Clear acrylic backing gives the traditional, old-school look with visible wiring; panels can be rectangular, square, rounded or cut to shape on our high-end laser cutters for an extremely accurate finish. Panels install with metal panel mounts, or with wiring, depending on the situation.",
        ],
      },
      {
        heading: "A myriad of colours",
        paragraphs: [
          "As a specialist neon sign company in Sydney, we offer plenty of LED tubing colours. Consider how your chosen colours will look with the sign switched off as well as on. The most popular colours include:",
        ],
        bullets: [
          "Warm white",
          "Pure white",
          "Red",
          "Green",
          "Blue",
          "Pink",
          "Yellow",
          "Orange",
          "Purple",
        ],
      },
      {
        heading: "Dimmers, wiring and control",
        paragraphs: [
          "Neon signs are bright and change the tone of a room with the colour they emit. Add a dimmer to control it — one of the advantages of modern LED-based neon. We customise the wiring to your specification: black, white or clear wire, cut to the length that reaches your power outlet, fitted with a standard plug or wired into the existing lighting system.",
        ],
      },
      {
        heading: "Delivery and installation",
        paragraphs: [
          "We can package your neon sign for dispatch with our courier network, with our install team on hand over the phone for any assistance during installation. Alternatively, we install the sign for you: provide your address, the nearest power source and photos of the area, and we will quote the installation. From conception to installation, our team takes your neon project the whole way.",
        ],
      },
      {
        heading: "Traditional neon vs LED neon",
        paragraphs: [
          "Traditional neon signs are hand-crafted from glass tubes filled with gas that produces the fluorescent light people identify as “neon”. It looks cool, but it is a dying art — more complex, expensive and time-consuming to produce, a heavy energy user, and fragile.",
          "LED neon signs are fabricated from light-emitting diodes connected into a reliable light source. Flex LED neon comes on an acrylic backing that can be cut to shape — usually transparent, but available in multiple colours, with vinyl application or direct printing when a pattern is involved. The backing keeps the flexible tubes in shape.",
        ],
      },
    ],
    related: [
      { label: "Illuminated Signs", href: "/illuminated-signs/" },
      { label: "LED Signs", href: "/led-signs/" },
      { label: "3D Lettering", href: "/3d-lettering/" },
      { label: "Sign Design Service", href: "/design-service/" },
    ],
  },

  "reception-signs": {
    eyebrow: "In depth",
    title: "First impressions are made at reception.",
    sections: [
      {
        heading: "No second chance at a first impression",
        paragraphs: [
          "Reception and entrance signage is often the first thing customers see — and you don't get a second chance to make a first impression. Reception signage is a crucial part of brand identity, and our office and reception range offers plenty of options to make your premises look smart and professional.",
          "Among our most popular products: acrylic panels, cut-out 3D letters and logos (illuminated or not), metal signs, window and wall graphics for entrance areas, and frosting film. We can design reception signage that is simple but still conveys your brand, or cutting-edge 3D and LED signage — it all depends on your brand and your budget.",
          "Our signs are fabricated in Sydney by our own team, and we deliver projects across the country through a wide network of highly qualified installers. Many large retailers and businesses come to us; no sign contract is too big or too small.",
        ],
      },
      {
        heading: "Reception signs that go wow",
        paragraphs: [
          "The foyer and reception areas are fundamental in showing what your business is about. Our design team works with design agencies, architectural firms and fit-out companies to achieve strikingly beautiful signage for corporate clients. Call to discuss your ideas — we manufacture on premises in Sydney and install nationwide.",
        ],
      },
      {
        heading: "The reception signage we offer",
        bullets: [
          "Laser-cut logos and lettering",
          "CNC router-cut MDF lettering",
          "Custom painting of logos and cut-out letters",
          "Acrylic panels in 3mm, 4.5mm, 10mm and 20mm thickness — any size within 1220mm × 2440mm, in various colours",
          "3D cut-out wall lettering and full-print wall graphics",
          "Frosted window film — plain, cut-out, printed and textured options",
          "Window decals and graphics",
          "Acrylic 3D letters",
          "Illuminated signs",
          "Metal panels and metal 3D lettering",
          "Brushed stainless steel signs",
          "Fully custom reception signs",
        ],
      },
    ],
    related: [
      { label: "Office Signage", href: "/signage-in-office/" },
      { label: "3D Lettering", href: "/3d-lettering/" },
      { label: "Acrylic Signs", href: "/acrylic-signs/" },
      { label: "Illuminated Signs", href: "/illuminated-signs/" },
    ],
  },

  "signage-in-office": {
    eyebrow: "In depth",
    title: "Office signage, inside and out.",
    sections: [
      {
        heading: "Signage for employees and customers",
        paragraphs: [
          "Office signage conveys your brand to both employees and customers — internal to the business and external to the street. We specialise in office signage: from simpler solutions like manifestation strips for glass partitions, through to beautiful, striking LED signs for reception areas. We work on every aspect of corporate signs, from a single office with a few staff to large multi-level premises and nationwide office rebranding projects, delivered through a strong network of signwriters who carry out the installations.",
        ],
      },
      {
        heading: "Explore office sign solutions",
        paragraphs: [
          "Office signage can be made from many materials, each creating its own look and feel. A non-exhaustive list of what we fabricate:",
        ],
        bullets: [
          "Acrylic panels — clear with cut-out elements applied, or coloured",
          "Window frosting film — from standard film to cut-out, printed and patterned options including the exclusive 3M Fasara range",
          "Reception signs — deep acrylic panels, cut-out lettering or custom illuminated signs",
          "Brushed, gold or mirror 3D lettering",
          "Laser and CNC router cut-out signs",
          "Illuminated and LED signs",
          "Custom LED neon signs",
          "Metal signs and custom painted signs",
          "Wall graphics — from cut-out graphics to full-panel prints covering entire walls",
          "Window signs — one-way vision, block-out vinyl, frosting film, translucent vinyl, cut-out prints",
          "Office door signage and hours-of-operation signage",
          "Panel mounting systems",
        ],
      },
      {
        heading: "Your brand identity via signage",
        paragraphs: [
          "There are two main purposes for signs in an office or reception area: direction, so people can easily find your business, and consistency, so every surface delivers an image that matches your company brand. Our design team takes the time to discuss the best options for your custom office signage project — the most suitable materials, design options, and the building and placement of your signs.",
        ],
      },
      {
        heading: "How we work with your team",
        paragraphs: [
          "Our signwriters can work directly with your team, or with your preferred graphic design company, fit-out or building company, interior designers and architects. We send experienced signwriters onsite to take measurements, present options — illuminated, 3D signage, frosting film, wall and window graphics — and confirm what can be achieved within your budget and the limitations of the building. Vibrant office signs make employees happy, and tell customers you are a reliable, desirable business.",
        ],
      },
    ],
    related: [
      { label: "Reception Signs", href: "/reception-signs/" },
      { label: "Acrylic Signs", href: "/acrylic-signs/" },
      { label: "Illuminated Signs", href: "/illuminated-signs/" },
      { label: "Sign Design Service", href: "/design-service/" },
    ],
  },
};
