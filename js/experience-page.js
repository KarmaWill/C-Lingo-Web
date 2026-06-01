(function () {
  var LEARNER_FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSdnpLO7SIOlAAIsz54r0cfIx-aIbGOj3C2njGSZW8BwE02Ujg/viewform?usp=dialog';
  var CONTACT = 'llh@clingo.hk';
  var mounted = false;

  function lead(text) {
    return '<p class="exp-role-lead">' + text + '</p>';
  }

  function points(items) {
    return '<div class="exp-role-items">' + items.map(function (text) {
      return '<div class="exp-role-item"><span class="exp-role-item-dot" aria-hidden="true"></span><p>' + text + '</p></div>';
    }).join('') + '</div>';
  }

  function detailBlocks(blocks) {
    return '<div class="exp-role-items">' + blocks.map(function (block) {
      return '<div class="exp-role-item exp-role-item--detail"><strong>' + block[0] + '</strong><p>' + block[1] + '</p></div>';
    }).join('') + '</div>';
  }

  function stepList(steps) {
    return '<div class="exp-role-items">' + steps.map(function (text, idx) {
      return '<div class="exp-role-item exp-role-item--step"><span class="exp-role-item-num">' + (idx + 1) + '</span><p>' + text + '</p></div>';
    }).join('') + '</div>';
  }

  function howSteps() {
    var steps = [
      ['Apply or Contact', 'Learners and educators submit applications; institutions and organizations contact the program team.'],
      ['Screening & Confirmation', 'C-Lingo reviews participant suitability, learning or teaching needs and available project resources.'],
      ['Pre-Assessment & Onboarding', 'Selected learners complete an HSK mock pre-assessment and receive tablet usage and experience guidance.'],
      ['4-Week Tablet Experience', 'Learners use the tablet regularly; educators may use it in teaching and organize student learning where confirmed.'],
      ['Post-Assessment & Feedback', 'Learners complete an HSK mock post-assessment; participants submit experience feedback and summaries.'],
      ['Recognition & Outcomes', 'C-Lingo reviews outcomes, confirms certificates and rewards, and shares authorized project stories.']
    ];
    var icons = ['▤', '◔', '☷', '▯', '⌁', '✦'];
    return '<div class="exp-process-timeline">' + steps.map(function (s, i) {
      return '<div class="exp-process-step">' +
        '<div class="exp-process-icon" aria-hidden="true">' + icons[i] + '</div>' +
        '<div class="exp-process-num">' + (i + 1) + '</div>' +
        '<h4>' + s[0] + '</h4>' +
        '<p>' + s[1] + '</p>' +
      '</div>';
    }).join('') + '</div>';
  }

  function faqGroup(title, items) {
    return '<div class="exp-faq-group"><h3>' + title + '</h3>' + items.map(function (q) {
      return '<details class="exp-faq-item"><summary>' + q.q + '</summary><p>' + q.a + '</p></details>';
    }).join('') + '</div>';
  }

  var roles = [
    {
      id: 'learner',
      label: 'Learners',
      intro: 'Join a real 4-week Chinese learning experience with the C-Lingo AI Chinese Learning Tablet. Selected learners will receive free access to the tablet during the experience period. Your learning focus and tasks will be arranged according to your Chinese level, learning background and personal goals. Learners who complete the program successfully and demonstrate strong participation may earn the chance to keep the tablet permanently.',
      sections: [
        { h: 'Who This Is For', html: points([
          'Beginners who want to start learning Chinese with a clearer and more structured path;',
          'Non-Chinese-major students who need systematic support to build Chinese ability;',
          'Chinese-major students or intermediate-to-advanced learners who want to consolidate vocabulary, strengthen comprehension and continue progressing through structured digital learning;',
          'Learners who are preparing for HSK or want to better understand their Chinese progress;',
          'Participants willing to complete the full 4-week experience and provide authentic feedback.'
        ])},
        { h: 'What You Will Receive', html: points([
          'Free access to the C-Lingo AI Chinese Learning Tablet during the 4-week experience;',
          'Learning tasks suited to your Chinese level and goals;',
          'HSK mock pre- and post-assessments to observe progress;',
          'Tablet usage guidance and experience instructions;',
          'Feedback follow-up from the C-Lingo product team;',
          'The opportunity to receive an official participation certificate;',
          'The chance to earn rewards and keep the tablet permanently;',
          'Priority access to future product updates, new features and participant benefits for outstanding participants.'
        ])},
        { h: 'What You Will Do', html: detailBlocks([
          ['Daily Tablet Use', 'Use the C-Lingo AI Chinese Learning Tablet for approximately 15–20 minutes per day during the experience period.'],
          ['Pre- & Post-Assessment', 'Complete an HSK mock assessment before and after the 4-week experience.'],
          ['Learning Tasks', 'Complete required learning tasks according to your learning focus and program guidance.'],
          ['Product Feedback', 'Submit feedback on functions, content, bugs or usage experience. Relevant feedback will be reviewed and followed up by the C-Lingo product team.'],
          ['Experience Video', 'Record authentic tablet usage or experience-sharing videos according to the program guidelines.'],
          ['Social Media Sharing', 'Share selected authentic experience content on your own social media platform according to the program requirements.'],
          ['Content Authorization', 'Authorize C-Lingo to use agreed experience materials for official project communication and outcome showcase within the confirmed scope.'],
          ['Final Summary', 'Submit your overall experience, learning progress and product suggestions at the end of the program.']
        ]) },
        { h: 'Learner Participation Flow', html: stepList([
          'Submit your learner application form.',
          'C-Lingo reviews your Chinese learning background, goals and participation fit.',
          'Selected learners receive confirmation and complete the HSK mock pre-assessment.',
          'You receive the C-Lingo AI Chinese Learning Tablet, usage materials and experience task guidelines.',
          'You join the 4-week tablet experience and complete the required learning, feedback and sharing tasks.',
          'You complete the HSK mock post-assessment and submit your final experience summary.',
          'C-Lingo reviews learning outcomes, participation performance, rewards and priority experience eligibility.'
        ])},
        { h: 'Selection Criteria', html: lead('Applicants may be prioritized based on:') + points([
          'Genuine interest in learning Chinese;',
          'Clear learning motivation or Chinese improvement goals;',
          'Ability to complete the 4-week experience period;',
          'Willingness to use the tablet regularly and complete assessments;',
          'Willingness to provide authentic product feedback;',
          'Willingness to record and share genuine experience content according to program requirements.'
        ])},
        { h: 'Recognition & Rewards', html: detailBlocks([
          ['Participation Certificate', 'Learners who complete the basic program requirements may receive a C-Lingo Learner Participant Certificate.'],
          ['Progress & Feedback Rewards', 'Rewards may be offered based on learning progress, feedback value, bug reporting quality and content contribution.'],
          ['Tablet Ownership Opportunity', 'Learners who actively participate, complete the core experience tasks and meet the program criteria may earn the opportunity to keep the C-Lingo AI Chinese Learning Tablet permanently.'],
          ['Priority Experience List', 'Outstanding participants may be invited to join C-Lingo\'s priority experience list for early access to future product updates, new features and new experiences.'],
          ['Long-Term Benefits', 'Priority participants may receive invitations to future user co-creation activities, exclusive campaigns and long-term participant benefits.']
        ]) },
        { h: 'Important Notes', html: points([
          'Free tablet experience is available to selected participants only.',
          'Learning focus and task arrangements will be determined by C-Lingo based on participant fit and program capacity.',
          'The opportunity to keep the tablet is not automatic and depends on task completion, participation quality and program evaluation.',
          'HSK mock assessment access will be provided after participant selection.',
          'Content sharing and official use of submitted materials will be subject to clear authorization.',
          'For younger participants, participation may require parent or guardian consent and supervision.'
        ])}
      ],
      cta: { title: 'Ready to Start Your AI Chinese Learning Experience?', primary: 'Apply as a Learner', href: LEARNER_FORM, external: true }
    },
    {
      id: 'educator',
      label: 'Educators',
      intro: 'Join C-Lingo as an educator participant and explore how the C-Lingo AI Chinese Learning Tablet can support real Chinese teaching, student learning tasks and your existing course content.',
      sections: [
        { h: 'Who This Is For', html: points([
          'Chinese teachers in schools, universities or language institutions;',
          'Educators interested in using an AI-powered Chinese learning tablet in real teaching contexts;',
          'Teachers who would like to organize students to learn with the tablet;',
          'Teachers who want to assign after-class tablet-based learning tasks;',
          'Educators interested in customized content support based on their current textbooks or teaching materials.'
        ])},
        { h: 'What C-Lingo Can Provide', html: detailBlocks([
          ['Teacher Tablet Support', 'A C-Lingo AI Chinese Learning Tablet for teaching use and experience feedback.'],
          ['Student Tablet Support', 'Subject to confirmed arrangements, tablet support for participating students in your class or learning group.'],
          ['Product Usage Materials', 'Product introductions, operation guides and teaching usage reference materials.'],
          ['Customized Content Support', 'Content adaptation support based on legally usable or authorized textbooks, teaching materials or course needs.'],
          ['Feedback Communication', 'Opportunities to share teaching feedback, student observations and product suggestions with the C-Lingo team.'],
          ['Recognition & Showcase', 'Participation recognition and the opportunity to feature representative teaching feedback or practice outcomes.']
        ]) },
        { h: 'What Educators Will Do', html: detailBlocks([
          ['Provide Teaching Context', 'Share information about your student group, Chinese level, class size, current teaching materials and intended participation format.'],
          ['Use the Tablet in Teaching', 'Use the C-Lingo AI Chinese Learning Tablet during teaching or related Chinese learning activities.'],
          ['Organize Student Learning', 'Where confirmed, organize participating students to use tablets for classroom learning or related learning experiences.'],
          ['Assign After-Class Tasks', 'Where suitable, assign tablet-based learning or review tasks after class.'],
          ['Provide Product Feedback', 'Share feedback on tablet functions, content presentation, user experience and teaching suitability.'],
          ['Provide Learning Observations', 'Share observations of students\' participation, learning experience and progress.'],
          ['Compare Teaching Experience', 'Based on your teaching experience, comment on differences between using the tablet and traditional teaching approaches.'],
          ['Support Outcome Sharing', 'Subject to authorization, participate in project summaries or representative case sharing.']
        ]) },
        { h: 'Educator Participation Flow', html: stepList([
          'Submit your educator application form.',
          'Share your teaching context, student needs and intended participation direction.',
          'C-Lingo reviews tablet support, student participation and customized content requirements.',
          'Receive confirmed tablets, product materials and participation guidance.',
          'Use the tablet in teaching, organize student participation or apply customized content where relevant.',
          'Submit teaching feedback, student observations and comparison insights.',
          'Receive participation recognition and discuss possible follow-up collaboration.'
        ])},
        { h: 'Selection Criteria', html: lead('Educator applications may be prioritized based on:') + points([
          'A clear Chinese teaching context or relevant student group;',
          'Potential use of the tablet in actual teaching or student learning;',
          'Willingness to provide meaningful feedback and observations;',
          'Need for student tablet support or customized content support;',
          'Potential for continued teaching, content or institutional collaboration.'
        ])},
        { h: 'Important Notes', html: points([
          'Teacher and student tablet support will be confirmed according to program arrangements and available resources.',
          'Customized content support is subject to review and the legal use or authorization status of provided materials.',
          'Teaching feedback and related content will only be used publicly with appropriate authorization.',
          'C-Lingo will support tablet arrangements, participant guidance, feedback collection and outcome organization; educators are not expected to manage the full program independently.'
        ])},
        { h: 'Educator Recognition', html: points([
          'A C-Lingo Educator Participant Certificate;',
          'Joint recognition with the participating school or institution, where confirmed;',
          'Featured teaching feedback or practice outcomes;',
          'Priority consideration for future product, content or teaching collaboration.'
        ])}
      ],
      cta: { title: 'Bring AI-Powered Chinese Learning into Your Teaching', primary: 'Contact for Educator Participation', href: 'mailto:' + CONTACT }
    },
    {
      id: 'school',
      label: 'Schools & Institutions',
      intro: 'C-Lingo welcomes collaboration with schools and educational institutions seeking to provide learners and educators with AI-powered Chinese learning support, tablet-based learning experiences and customized learning content.',
      sections: [
        { h: 'Possible Collaboration Directions', html: points([
          'Recommend suitable learners and educators to participate in the program;',
          'Arrange student or class-based tablet experience opportunities;',
          'Apply for teacher or learner tablet support;',
          'Discuss tablet donation opportunities for relevant education projects;',
          'Provide legally usable or authorized teaching materials for customized content support;',
          'Co-recognize participating educators through certificates or project acknowledgment;',
          'Participate in outcome sharing and follow-up education collaboration.'
        ])},
        { h: 'What Your Institution May Gain', html: points([
          'Tablet-supported Chinese learning opportunities for learners and educators;',
          'Customized content support based on existing course needs;',
          'Student experience records and learning outcome references;',
          'Educator feedback and recognition opportunities;',
          'Project outcome sharing and education exchange visibility;',
          'A foundation for longer-term tablet, content or education collaboration.'
        ])}
      ],
      cta: { title: 'Interested in Institutional Collaboration?', primary: 'Contact for Institutional Partnership', href: 'mailto:' + CONTACT }
    },
    {
      id: 'public',
      label: 'Public Organizations',
      intro: 'C-Lingo welcomes guidance and collaboration from public institutions and organizations supporting international Chinese education, youth exchange and cultural understanding. Through the C-Lingo AI Chinese Learning Tablet, education-focused donation initiatives, real learner experiences and outcome sharing, we hope to support more overseas learners in accessing Chinese learning resources and understanding Chinese culture.',
      sections: [
        { h: 'C-Lingo Can Provide', html: points([
          'C-Lingo AI Chinese Learning Tablets for qualified education projects;',
          'Tablet donation support, subject to confirmed project arrangements;',
          'Learner experience programs with assessment and feedback outcomes;',
          'Educator participation and customized content support;',
          'Project launch, donation activity and outcome showcase content;',
          'Authorized communication materials supporting international Chinese education and cultural exchange.'
        ])},
        { h: 'We Welcome Support In', html: points([
          'Program guidance and professional exchange;',
          'Connections with schools, educators, institutions and learner communities;',
          'Support for tablet donation initiatives or education exchange activities;',
          'Participation in project launch or outcome-sharing activities;',
          'Communication and outreach supporting international Chinese education and cultural understanding.'
        ])}
      ],
      cta: { title: 'Explore Guidance & Support Collaboration', primary: 'Contact the Program Team', href: 'mailto:' + CONTACT }
    }
  ];

  function roleMeta(role) {
    var meta = {
      learner: { icon: '<svg class="exp-role-avatar" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="4"></circle><path d="M9 24c1.4-4 4-6 7-6s5.6 2 7 6"></path><path d="M8 14.5h5.5c1.5 0 2.5 1 2.5 2.5v8H10c-1.1 0-2-.9-2-2v-8.5z"></path><path d="M24 14.5h-5.5c-1.5 0-2.5 1-2.5 2.5v8h6c1.1 0 2-.9 2-2v-8.5z"></path></svg>', sub: '4-week guided learning' },
      educator: { icon: '<svg class="exp-role-avatar" viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="11" r="3.5"></circle><path d="M5.5 24c1.1-4 3-6 5.5-6s4.4 2 5.5 6"></path><path d="M18 8h8v12h-8"></path><path d="M19 13h5"></path><path d="M16 17l5-3"></path></svg>', sub: 'Teaching practice support' },
      school: { icon: '<svg class="exp-role-avatar" viewBox="0 0 32 32" aria-hidden="true"><path d="M6 14l10-6 10 6"></path><path d="M8 14v10h16V14"></path><path d="M13 24v-6h6v6"></path><path d="M11 16h2"></path><path d="M19 16h2"></path></svg>', sub: 'Institutional collaboration' },
      public: { icon: '<svg class="exp-role-avatar" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="3"></circle><circle cx="9" cy="20" r="3"></circle><circle cx="23" cy="20" r="3"></circle><path d="M14 12.5l-3 4.8"></path><path d="M18 12.5l3 4.8"></path><path d="M12 20h8"></path></svg>', sub: 'Education exchange support' }
    };
    return meta[role.id] || { icon: '<svg class="exp-role-avatar" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="8"></circle></svg>', sub: 'Program role' };
  }

  function roleFlipbook(role) {
    var pages = role.sections.map(function (s, i) {
      return '<section class="exp-role-section' + (i === 0 ? ' is-active' : '') + '" data-page="' + i + '" data-title="' + s.h + '">' + s.html + '</section>';
    }).join('');
    var tabs = role.sections.map(function (s, i) {
      return '<button type="button" class="exp-flip-tab' + (i === 0 ? ' active' : '') + '" data-page="' + i + '" aria-label="' + s.h + '">' +
        '<span class="exp-flip-tab-num">' + (i + 1) + '</span>' +
        '<span class="exp-flip-tab-label">' + s.h + '</span>' +
      '</button>';
    }).join('');
    return '<div class="exp-role-flipbook" data-pages="' + role.sections.length + '">' +
      '<div class="exp-role-flipbook-toolbar">' +
        '<button type="button" class="exp-flip-btn exp-flip-prev" aria-label="Previous section" disabled>←</button>' +
        '<div class="exp-role-flipbook-tabs" role="tablist">' + tabs + '</div>' +
        '<button type="button" class="exp-flip-btn exp-flip-next" aria-label="Next section"' + (role.sections.length <= 1 ? ' disabled' : '') + '>→</button>' +
      '</div>' +
      '<div class="exp-role-flipbook-viewport">' +
        '<div class="exp-role-flipbook-stage">' + pages + '</div>' +
      '</div>' +
    '</div>';
  }

  function initRoleFlipbooks(root) {
    root.querySelectorAll('.exp-role-flipbook').forEach(function (book) {
      if (book.dataset.flipInit) return;
      book.dataset.flipInit = '1';
      var pages = book.querySelectorAll('.exp-role-section');
      var tabs = book.querySelectorAll('.exp-flip-tab');
      var prevBtn = book.querySelector('.exp-flip-prev');
      var nextBtn = book.querySelector('.exp-flip-next');
      var idx = 0;
      var animating = false;

      function syncControls() {
        prevBtn.disabled = idx === 0;
        nextBtn.disabled = idx >= pages.length - 1;
        tabs.forEach(function (t, i) { t.classList.toggle('active', i === idx); });
      }

      function goTo(newIdx, direction) {
        if (animating || newIdx === idx || newIdx < 0 || newIdx >= pages.length) return;
        animating = true;
        var out = pages[idx];
        var inn = pages[newIdx];
        direction = direction || (newIdx > idx ? 1 : -1);
        out.classList.add(direction > 0 ? 'flip-out-forward' : 'flip-out-back');
        inn.classList.add(direction > 0 ? 'flip-in-forward' : 'flip-in-back', 'is-active');
        setTimeout(function () {
          out.classList.remove('is-active', 'flip-out-forward', 'flip-out-back');
          inn.classList.remove('flip-in-forward', 'flip-in-back');
          idx = newIdx;
          syncControls();
          animating = false;
        }, 460);
      }

      book.goToPage = function (pageIdx) {
        goTo(pageIdx, pageIdx > idx ? 1 : -1);
      };

      book.resetPage = function () {
        pages.forEach(function (p, i) {
          p.classList.remove('flip-out-forward', 'flip-out-back', 'flip-in-forward', 'flip-in-back');
          p.classList.toggle('is-active', i === 0);
        });
        idx = 0;
        syncControls();
        animating = false;
      };

      prevBtn.addEventListener('click', function () { goTo(idx - 1, -1); });
      nextBtn.addEventListener('click', function () { goTo(idx + 1, 1); });
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          goTo(parseInt(tab.dataset.page, 10));
        });
      });
    });
  }

  function rolePanel(role, idx) {
    var cta = role.cta ? '<div class="exp-role-cta">' +
      '<h4>' + role.cta.title + '</h4>' +
      (role.cta.external
        ? '<a class="btn-primary" href="' + role.cta.href + '" target="_blank" rel="noopener noreferrer">' + role.cta.primary + '</a>'
        : '<a class="btn-primary" href="' + role.cta.href + '">' + role.cta.primary + '</a>') +
      '</div>' : '';
    var meta = roleMeta(role);
    return '<div class="exp-role-panel' + (idx === 0 ? ' active' : '') + '" id="exp-role-' + role.id + '">' +
      '<div class="exp-role-panel-hero">' +
        '<div class="exp-role-panel-mark">' + meta.icon + '</div>' +
        '<div><div class="eyebrow">For ' + role.label + '</div><p class="exp-role-intro">' + role.intro + '</p></div>' +
      '</div>' +
      roleFlipbook(role) +
      cta +
    '</div>';
  }

  window.mountExperiencePage = function () {
    if (mounted) return;
    var root = document.getElementById('page-experience');
    if (!root) return;
    mounted = true;

    root.innerHTML =
      '<div class="experience-hero">' +
        '<div class="experience-hero-bg" aria-hidden="true"></div>' +
        '<div class="experience-hero-inner animate-in">' +
          '<div class="experience-hero-copy">' +
            '<div class="hero-label">C-LINGO EXPERIENCE PROGRAM</div>' +
            '<h1>A 4-Week AI-Powered<br>Chinese Learning &amp;<br>Education Co-Creation Program</h1>' +
            '<p class="exp-hero-desc">Designed for Chinese learners, educators, schools, educational<br>institutions and supporting organizations worldwide.</p>' +
            '<div class="exp-hero-highlight">' +
              '<span class="exp-hero-highlight-icon" aria-hidden="true">✦</span>' +
              '<p>Selected learners can experience the tablet for free and may earn the chance to keep it permanently.</p>' +
            '</div>' +
            '<div class="hero-actions">' +
              '<a class="hero-offer-mark exp-apply-mark" href="' + LEARNER_FORM + '" target="_blank" rel="noopener noreferrer">Apply Now</a>' +
              '<a class="btn-dark" href="#experience-roles">Explore Roles →</a>' +
            '</div>' +
          '</div>' +
          '<div class="experience-hero-visual" aria-hidden="true">' +
            '<img src="assets/product-tablet.png" alt="C-Lingo AI Chinese Learning Tablet">' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<section class="section-full exp-section exp-overview-section">' +
        '<div class="exp-inner">' +
          '<div class="exp-overview-head animate-in">' +
            '<div class="exp-overview-title-block">' +
              '<div class="eyebrow">Program Overview</div>' +
              '<h2 class="section-title">Connecting Chinese Learning, Teaching Practice and Education Exchange through AI</h2>' +
              '<div class="subtitle exp-overview-subtitle">C-Lingo launched this program to bring its AI Chinese Learning Tablet into real learning and teaching environments.</div>' +
            '</div>' +
          '</div>' +
          '<div class="exp-overview-grid animate-in" style="transition-delay:0.1s">' +
            '<div class="exp-overview-card"><span aria-hidden="true">▣</span><h4>What This Program Is</h4><p>A real-world Chinese learning and education co-creation program powered by C-Lingo\'s intelligent learning products.</p></div>' +
            '<div class="exp-overview-card"><span aria-hidden="true">✦</span><h4>What We Provide</h4><p>Product experience for selected learners, device support for educators, customized content opportunities and partnership support for institutions and public-interest projects.</p></div>' +
            '<div class="exp-overview-card"><span aria-hidden="true">☷</span><h4>Who Can Join</h4><p>Learners · Educators · Schools &amp; Educational Institutions · Public Institutions &amp; Supporting Organizations</p></div>' +
            '<div class="exp-overview-card"><span aria-hidden="true">◷</span><h4>Program Duration</h4><p>4 Weeks · Product Experience · Assessments · Feedback · Outcome Sharing</p></div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section-full exp-section exp-section--dark">' +
        '<div class="exp-inner">' +
          '<div class="section-header-centered animate-in"><div class="eyebrow">Process</div>' +
          '<h2 class="section-title" style="color:#F7FFF6;">How It Works</h2>' +
          '<p class="section-sub" style="color:rgba(236,255,244,0.72);">From Application to Measurable Learning Experience</p></div>' +
          '<div class="animate-in" style="transition-delay:0.1s">' + howSteps() + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section-full exp-section" id="experience-roles">' +
        '<div class="exp-inner">' +
          '<div class="section-header-centered animate-in"><div class="eyebrow">Participation</div>' +
          '<h2 class="section-title">Choose Your Role</h2>' +
          '<p class="section-sub">Select a participant type to view requirements, benefits and how to join.</p></div>' +
          '<div class="exp-role-nav animate-in">' + roles.map(function (r, i) {
            var meta = roleMeta(r);
            return '<button type="button" class="exp-role-btn' + (i === 0 ? ' active' : '') + '" data-exp-role="' + r.id + '">' +
              '<span class="exp-role-btn-icon">' + meta.icon + '</span>' +
              '<span><strong>' + r.label + '</strong><small>' + meta.sub + '</small></span>' +
            '</button>';
          }).join('') + '</div>' +
          '<div class="exp-role-panels animate-in">' + roles.map(rolePanel).join('') + '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section-full exp-section exp-section--soft exp-faq-section">' +
        '<div class="exp-inner">' +
          '<div class="exp-faq-layout">' +
            '<div class="exp-faq-aside animate-in">' +
              '<h2 class="section-title">Frequently Asked Questions</h2>' +
              '<div class="subtitle exp-faq-subtitle">Quick answers for learners, educators, schools and organizations before joining the C-Lingo Experience Program.</div>' +
            '</div>' +
            '<div class="exp-faq-list animate-in">' +
            faqGroup('Learners', [
              { q: 'Is the learner experience free?', a: 'Selected learner participants will receive free access to the tablet during the 4-week experience period.' },
              { q: 'Can I keep the tablet after the program?', a: 'Learners who actively participate, complete the core experience tasks and meet the program evaluation criteria may earn the opportunity to keep their tablet permanently.' },
              { q: 'Do I need prior Chinese learning experience?', a: 'No. The program is designed for learners at different levels.' },
              { q: 'How much time do I need each day?', a: 'Learner participants are expected to use the tablet for approximately 15–20 minutes per day during the 4-week experience.' },
              { q: 'Do I need to complete assessments?', a: 'Yes. Selected learners are expected to complete an HSK mock assessment before and after the experience period.' },
              { q: 'Can younger learners participate?', a: 'Younger participants may join with parent or guardian consent and supervision, subject to program arrangements.' }
            ]) +
            faqGroup('Educators', [
              { q: 'Can educators participate with their students?', a: 'Yes. Educators may apply for their own tablet experience and, where arrangements allow, organize suitable students to participate with tablet support.' },
              { q: 'Do I need to change my current teaching materials?', a: 'No. Where relevant and legally permitted, C-Lingo may support content adaptation based on your existing teaching materials or course needs.' },
              { q: 'What feedback is expected from educators?', a: 'Educators may provide feedback on tablet usage, student participation, learning observations, after-class task experience and comparisons with traditional teaching approaches.' }
            ]) +
            faqGroup('Institutions & Organizations', [
              { q: 'How can a school or educational institution collaborate?', a: 'Schools and educational institutions may contact the program team to discuss learner participation, educator involvement, tablet support, customized content or longer-term collaboration.' },
              { q: 'Can C-Lingo provide tablet donation support?', a: 'For projects with clear international Chinese education or cultural exchange value, C-Lingo may discuss tablet donation support based on formal project confirmation.' },
              { q: 'How can public institutions or supporting organizations get involved?', a: 'Relevant organizations may contact the program team to discuss guidance, resource connections, education exchange activities, tablet donation initiatives and outcome sharing.' }
            ]) +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section-full exp-cta-section" id="experience-apply">' +
        '<div class="exp-inner exp-cta-inner animate-in">' +
          '<div class="exp-cta-copy">' +
            '<div class="eyebrow">Apply / Collaborate</div>' +
            '<h2>Ready to Get Involved?</h2>' +
            '<p>Apply as a learner or educator, or contact us to explore institutional partnership, education support and international Chinese education collaboration opportunities.</p>' +
          '</div>' +
          '<div class="exp-cta-card">' +
            '<div class="exp-cta-actions">' +
              '<a class="btn-primary" href="' + LEARNER_FORM + '" target="_blank" rel="noopener noreferrer">Apply as a Learner</a>' +
              '<a class="btn-outline" href="mailto:' + CONTACT + '">Contact Us</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';

    initRoleFlipbooks(root);

    root.querySelectorAll('.exp-role-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.dataset.expRole;
        root.querySelectorAll('.exp-role-btn').forEach(function (b) { b.classList.toggle('active', b === btn); });
        root.querySelectorAll('.exp-role-panel').forEach(function (p) {
          var isActive = p.id === 'exp-role-' + id;
          p.classList.toggle('active', isActive);
          if (isActive) {
            var book = p.querySelector('.exp-role-flipbook');
            if (book && book.resetPage) book.resetPage();
          }
        });
      });
    });

    if (typeof observeAnimations === 'function') observeAnimations();
  };
})();
