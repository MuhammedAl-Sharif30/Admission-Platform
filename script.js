// --- Screen Management Logic ---
function showScreen(screenId) { 
    console.log('Attempting to show screen:', screenId);
    
    // إخفاء جميع الشاشات
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // إظهار الشاشة المستهدفة
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.scrollTop = 0; // لضمان أن الشاشة تبدأ من الأعلى
        console.log(screenId + ' screen activated.');
    } else {
        console.error('Error: Screen with ID ' + screenId + ' not found.');
    }

    // إدارة الـ "active" class في شريط التنقل العلوي (للشاشات الكبيرة)
    const navLinks = document.querySelectorAll('.header .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-screen-id') === screenId) {
            link.classList.add('active');
        }
    });

    // إدارة الـ "active" class في شريط التنقل السفلي (للشاشات الصغيرة)
    const bottomNavItems = document.querySelectorAll('.bottom-nav-bar .bottom-nav-item');
    bottomNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-screen-id') === screenId) {
            item.classList.add('active');
        }
    });

    // إدارة الـ "active" class في القائمة الجانبية (للشاشات الصغيرة)
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-screen-id') === screenId) {
            link.classList.add('active');
        }
    });
}

// --- Sidebar Logic ---
function openSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.querySelector(".overlay").classList.add("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.querySelector(".overlay").classList.remove("active");
}

// --- WhatsApp Function ---
function openWhatsApp() {
    const phoneNumber = '+967776575356'; // رقم واتساب محمد الشريف مع رمز الدولة
    const message = encodeURIComponent('أهلاً، أود الاستفسار عن منصة القبول الطبي - اليمن.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_system');
}

// --- Testimonials Slider Logic ---
const testimonialSlider = document.getElementById('testimonialSlider');
const prevTestimonialBtn = document.getElementById('prevTestimonial');
const nextTestimonialBtn = document.getElementById('nextTestimonial');
const testimonialDotsContainer = document.getElementById('testimonialDots');
let currentTestimonialIndex = 0;
let testimonials = []; // سيتم ملؤها عند التحميل

function initializeTestimonialsSlider() {
    testimonials = Array.from(testimonialSlider.children);
    if (testimonials.length === 0) return;

    // إنشاء النقاط (Dots)
    testimonialDotsContainer.innerHTML = ''; // مسح النقاط القديمة
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showTestimonial(index));
        testimonialDotsContainer.appendChild(dot);
    });

    showTestimonial(0); // عرض الشهادة الأولى عند التحميل
}


// دالة لعرض الشهادة بناءً على الفهرس
function showTestimonial(index) {
    if (!testimonialSlider || testimonials.length === 0) return;

    // تأكد من أن الفهرس ضمن الحدود
    if (index >= testimonials.length) {
        currentTestimonialIndex = 0;
    } else if (index < 0) {
        currentTestimonialIndex = testimonials.length - 1;
    } else {
        currentTestimonialIndex = index;
    }

    // تحريك السلايدر
    const offset = -currentTestimonialIndex * 100; // تحريك بنسبة 100% لكل شهادة
    testimonialSlider.style.transform = `translateX(${offset}%)`;

    // تحديث النقاط (Dots)
    const dots = Array.from(testimonialDotsContainer.children);
    dots.forEach((dot, idx) => {
        dot.classList.remove('active');
        if (idx === currentTestimonialIndex) {
            dot.classList.add('active');
        }
    });
}


function nextTestimonial() {
    showTestimonial(currentTestimonialIndex + 1);
}

function prevTestimonial() {
    showTestimonial(currentTestimonialIndex - 1);
}

// إضافة مستمعات الأحداث للأزرار
if (prevTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', prevTestimonial);
}
if (nextTestimonialBtn) {
    nextTestimonialBtn.addEventListener('click', nextTestimonial);
}


// --- Exam Logic ---
// مصفوفات الأسئلة لكل مادة - تم إضافة حقل 'explanation'
const questionsBiology = [
    {
        question: "توجد صبغة الكلوروفيل في خلايا بعض الكائنات مثل ...",
        options: ["الفطريات", "البكتيريا", "النخيل", "البراميسيوم"],
        answer: "النخيل",
        explanation: "الكلوروفيل هي الصبغة الخضراء المسؤولة عن عملية البناء الضوئي، وتوجد بشكل أساسي في النباتات والطحالب وبعض أنواع البكتيريا. من بين الخيارات المعطاة، النخيل هو نبات ويحتوي على الكلوروفيل. الفطريات والبراميسيوم كائنات غير ذاتية التغذية لا تحتوي على الكلوروفيل. بعض أنواع البكتيريا تقوم بالبناء الضوئي لكن السؤال يركز على كائنات تحتوي الكلوروفيل بشكل عام."
    },
    {
        question: "في نبات الفيوناريا يتكون من القدم وشبه الساق والعنق والعلبة",
        options: ["المشيج المذكر", "النسيج المؤنث", "النبات البوغي", "النبات المشيجي"],
        answer: "النبات البوغي",
        explanation: "نبات الفيوناريا (من الحزازيات) يمر بدورة حياة تتناوب فيها الأجيال. النبات البوغي (Sporophyte) هو الجيل الذي ينتج الأبواغ، ويتكون من قدم (تتصل بالنبات المشيجي)، وعنق، وعلبة (حافظة الأبواغ)."
    },
    {
        question: "النخاع المستطيل هو الذي يربط بين ....",
        options: ["المخ والأعصاب", "المخيخ والأعصاب", "المخيخ والحبل الشوكي", "المخيخ والمخ"],
        answer: "المخيخ والحبل الشوكي",
        explanation: "النخاع المستطيل (Medulla Oblongata) هو جزء من جذع الدماغ، ويربط الدماغ (بما في ذلك المخيخ) بالحبل الشوكي، وينظم العديد من الوظائف الحيوية اللاإرادية."
    },
    {
        question: "ينطلق <span class='latex-math'>O<sub>2</sub></span> الناتج من البناء الضوئي إلى خارج النبات عن طريق ...",
        options: ["الثغور", "الجذور", "الأوراق", "النتح"],
        answer: "الثغور",
        explanation: "الثغور (Stomata) هي فتحات صغيرة توجد بشكل رئيسي على سطح الأوراق، تسمح بتبادل الغازات (دخول <span class='latex-math'>CO<sub>2</sub></span> وخروج <span class='latex-math'>O<sub>2</sub></span> وبخار الماء) بين النبات والغلاف الجوي."
    },
    {
        question: "تتكون أصابع اليدين والقدمين والأذنين ويظهر الجنين محاطاً بأربعة أغشية في....",
        options: ["الثلاثة الأشهر الأولى", "الثلاثة الأشهر الثانية", "الثلاثة الأشهر الأخيرة", "الثلاثة الأسابيع الأخيرة"],
        answer: "الثلاثة الأشهر الأولى",
        explanation: "تتطور الأعضاء الرئيسية للجنين، بما في ذلك تكون أصابع اليدين والقدمين والأذنين، وتشكل الأغشية الجنينية الأربعة (الكيس الأمينوسي، الكيس المحي، المشيمة، السقاء) بشكل أساسي خلال الثلاثة أشهر الأولى من الحمل (التي تتضمن المرحلة الجنينية المبكرة)."
    },
    {
        question: "مركبات تساعد الأعضاء على القيام بوظائفها هي ...",
        options: ["الأجسام المضادة", "الهرمونات", "الفيتامينات", "الإنزيمات"],
        answer: "الهرمونات",
        explanation: "الهرمونات هي مواد كيميائية تفرزها الغدد الصماء في مجرى الدم، وتعمل كرسل كيميائية تنظم وتنسق وظائف الأعضاء والخلايا المختلفة في الجسم."
    },
    {
        question: "تمر الخلايا المرستيمية بــ.....",
        options: ["جميع مراحل دورة الخلية", "بعض مراحل دورة الخلية", "طور السبات", "ليس مما سبق"],
        answer: "جميع مراحل دورة الخلية",
        explanation: "الخلايا المرستيمية هي خلايا نباتية غير متخصصة تتميز بقدرتها المستمرة على الانقسام. وللقيام بالانقسام، يجب أن تمر بجميع مراحل دورة الخلية (الطور البيني الذي يشمل G1, S, G2، والطور الانقسامي M)."
    },
    {
        question: "من أمراض المناعة الذاتية التي تستهدف الجهاز العصبي ...",
        options: ["الروماتويد", "المايلوما", "التصلب المتعدد", "ليس مما سبق"],
        answer: "التصلب المتعدد",
        explanation: "التصلب المتعدد (Multiple Sclerosis - MS) هو مرض مناعي ذاتي يهاجم فيه الجهاز المناعي للجسم غمد الميالين الذي يغطي الألياف العصبية في الدماغ والحبل الشوكي، مما يؤثر على إشارات الجهاز العصبي. الروماتويد (التهاب المفاصل الروماتويدي) يستهدف المفاصل بشكل أساسي، والمايلوما هو سرطان نخاع العظم."
    },
    {
        question: "تتم تفاعلات دورة كالفن في...",
        options: ["السيتوبلازم", "البلاستيدات", "النواة", "الميتوكوندريا"],
        answer: "البلاستيدات",
        explanation: "دورة كالفن (التفاعلات اللاضوئية للبناء الضوئي) تتم في لحمة (Stroma) البلاستيدات الخضراء، وهي الجزء السائل داخل البلاستيدة."
    },
    {
        question: "ساق أفقية تنمو تحت سطح التربة ...",
        options: ["الساق الجارية", "الكورمة", "البصلة", "الريزومة"],
        answer: "الريزومة",
        explanation: "الريزومة (Rhizome) هي ساق أرضية تنمو أفقياً تحت سطح التربة، وتخزن الغذاء وتساهم في التكاثر الخضري، مثل تلك الموجودة في الزنجبيل والقصب. الساق الجارية تنمو فوق سطح التربة. الكورمة والبصلة هي سيقان متحورة للتخزين ولكنها ليست أفقية."
    },
    {
        question: "جزء من مكونات النفرون يشبه الكوب ذا الجدار المزدوج....",
        options: ["محفظة بومان", "التواء هنلي", "كرية ملبيجي", "حوض الكلية"],
        answer: "محفظة بومان",
        explanation: "محفظة بومان (Bowman's Capsule) هي جزء أساسي من النفرون في الكلى، وهي عبارة عن تركيب يشبه الكوب ذو الجدار المزدوج يحيط بالكُبيبة (Glomerulus) ويبدأ فيها ترشيح الدم. كرية ملبيجي هي الكبيبة ومحفظة بومان معاً."
    },
    {
        question: "تعمل حركة أسواط الخلايا المطوقة في الإسفنج على....",
        options: ["دخول تيار الماء", "خروج تيار الماء", "دخول وخروج تيار الماء", "الحركة الأميبية"],
        answer: "دخول تيار الماء",
        explanation: "الخلايا المطوقة (Choanocytes) في الإسفنج مبطنة لتجويفه الداخلي، وتمتلك أسواطاً (Flagella) تتحرك باستمرار لتوليد تيار مائي يدخل من مسام الإسفنج حاملاً الغذاء والأكسجين، ويخرج من فتحة التويج (Osculum)."
    },
    {
        question: "..... هو أحد الأنسجة المستديمة البسيطة والذي يغطي جذور النبات.",
        options: ["البشرة", "القشرة", "الطلائي", "الضام الليفي"],
        answer: "البشرة",
        explanation: "البشرة (Epidermis) هي النسيج الواقي الذي يغطي السطح الخارجي للنباتات، بما في ذلك الجذور، لحمايتها. الأنسجة الطلائية والضامة هي أنسجة حيوانية."
    },
    {
        question: "ظاهرة تبادل الأجيال تحدث في ...",
        options: ["البراميسيوم", "الأميبا", "البلاناريا", "بلازموديوم الملاريا"],
        answer: "بلازموديوم الملاريا",
        explanation: "تبادل الأجيال (Alternation of Generations) هو ظاهرة تتضمن تعاقب جيل جنسي وجيل لاجنسي في دورة حياة الكائن الحي. بلازموديوم الملاريا (Plasmodium falciparum) يمتلك دورة حياة معقدة تتضمن مراحل جنسية ولاجنسية داخل مضيفين مختلفين (الإنسان والبعوض)، مما يمثل تبادل أجيال."
    },
    {
        question: "ينتج من الإخصاب المضاعف ....",
        options: ["اللاقحة", "نواة الإندوسبيرم الأولية", "خلية الإندوسبيرم الأم", "أ + ب"],
        answer: "أ + ب",
        explanation: "الإخصاب المضاعف (Double Fertilization) هو عملية فريدة تحدث في النباتات المزهرة. ينتج عنها شيئان: اللاقحة (Zygote) من اتحاد أحد الأمشاج الذكرية مع البويضة، ونواة الإندوسبيرم الأولية (Primary Endosperm Nucleus) من اتحاد المشيج الذكري الثاني مع النواتين القطبيتين، وتنمو لتشكل الإندوسبيرم (نسيج التغذية للجنين)."
    },
    {
        question: "نبات ....... يتكاثر خضرياً بواسطة نمو البراعم الجانبية في كل عين لتكوين نبات جديد.",
        options: ["البطاطس", "الثوم", "النخيل", "النجيل"],
        answer: "البطاطس",
        explanation: "البطاطس هي ساق درنية (Tubers) تحتوي على 'عيون' (Eyes) وهي في الواقع براعم. يمكن زراعة قطع من درنة البطاطس تحتوي على عين أو أكثر، وتنمو هذه البراعم لتشكل نباتات جديدة متطابقة وراثياً، وهذا شكل من أشكال التكاثر الخضري."
    },
    {
        question: "أحد الصفات الآتية لم يقم مندل بدراستها",
        options: ["لون الزهرة", "لون الساق", "لون البذرة", "لون القرن"],
        answer: "لون الساق",
        explanation: "قام مندل بدراسة سبع صفات في نبات البازلاء، وهي: طول الساق، شكل البذرة، لون البذرة، شكل القرن، لون القرن، لون الزهرة، وموقع الزهرة. لم يدرس 'لون الساق' كصفة مستقلة."
    },
    {
        question: "في الخطوة الثالثة من بناء البروتين يلتقي حمض..... مع حمض <span class='latex-math'>RNA</span> الناقل حيث يقوم الناقل بقراءة شفرته",
        options: ["<span class='latex-math'>mRNA</span>", "<span class='latex-math'>tRNA</span>", "<span class='latex-math'>rRNA</span>", "لا شيء مما سبق"],
        answer: "<span class='latex-math'>mRNA</span>",
        explanation: "في عملية بناء البروتين (الترجمة)، يحمل حمض <span class='latex-math'>mRNA</span> (الرنا الرسول) الشفرة الوراثية من النواة إلى الريبوسومات. حمض <span class='latex-math'>tRNA</span> (الرنا الناقل) يحمل الحمض الأميني المحدد ويقوم 'بقراءة' الشفرة الموجودة على <span class='latex-math'>mRNA</span> (عن طريق مضاد الكودون) ويلتقي به عند الريبوسوم. لذا، الـ <span class='latex-math'>tRNA</span> يلتقي مع الـ <span class='latex-math'>mRNA</span>."
    },
    {
        question: "تحتوي الخلايا العصوية على صبغة ........ والخلايا المخروطية على صبغة.........",
        options: ["الرودوبسين ، اليودوبسين", "الريتينال ، الرودوبسين", "اليودوبسين ، الرودوبسين", "لا شيء مما سبق"],
        answer: "الرودوبسين ، اليودوبسين",
        explanation: "الخلايا العصوية (Rods) المسؤولة عن الرؤية في الإضاءة الخافتة والرؤية الليلية تحتوي على صبغة الرودوبسين (Rhodopsin). الخلايا المخروطية (Cones) المسؤولة عن الرؤية الملونة والرؤية في الإضاءة الساطعة تحتوي على صبغة اليودوبسين (Iodopsin)."
    },
    {
        question: "ينتج عن السمنة ...",
        options: ["مرض السكري", "مشاكل في القلب", "ضيق في التنفس", "كل ما سبق"],
        answer: "كل ما سبق",
        explanation: "السمنة هي عامل خطر رئيسي للعديد من المشاكل الصحية الخطيرة، بما في ذلك مرض السكري من النوع 2، أمراض القلب والأوعية الدموية (مثل ارتفاع ضغط الدم وتصلب الشرايين)، ومشاكل التنفس (مثل انقطاع التنفس أثناء النوم)، بالإضافة إلى مشاكل أخرى في المفاصل وبعض أنواع السرطان."
    }
];

const questionsChemistry = [
    {
        question: "أي من المركبات التالية يعتبر ألكاناً حلقياً؟",
        options: ["<span class='latex-math'>C<sub>6</sub>H<sub>6</sub></span>", "<span class='latex-math'>C<sub>5</sub>H<sub>10</sub></span>", "<span class='latex-math'>C<sub>2</sub>H<sub>4</sub></span>", "<span class='latex-math'>C<sub>4</sub>H<sub>10</sub></span>"],
        answer: "<span class='latex-math'>C<sub>5</sub>H<sub>10</sub></span>",
        explanation: "الألكانات الحلقية (Cycloalkanes) لها الصيغة العامة <span class='latex-math'>C<sub>n</sub>H<sub>2n</sub></span>. <span class='latex-math'>C<sub>5</sub>H<sub>10</sub></span> هي صيغة البنتان الحلقي. <span class='latex-math'>C<sub>6</sub>H<sub>6</sub></span> هو البنزين (أروماتي)، <span class='latex-math'>C<sub>2</sub>H<sub>4</sub></span> هو الإيثين (ألكين)، <span class='latex-math'>C<sub>4</sub>H<sub>10</sub></span> هو البيوتان (ألكان مفتوح السلسلة)."
    },
    {
        question: "ما هو العنصر الذي يمتلك أعلى كهرسالبية في الجدول الدوري؟",
        options: ["الأكسجين", "النيتروجين", "الفلور", "الكلور"],
        answer: "الفلور",
        explanation: "الفلور (F) يقع في أعلى يمين الجدول الدوري (باستثناء الغازات النبيلة) ويمتلك أعلى كهرسالبية (قدرة الذرة على جذب الإلكترونات في الرابطة الكيميائية) بقيمة 3.98 على مقياس باولنغ."
    },
    {
        question: "ما نوع الرابطة المتكونة بين ذرة صوديوم (<span class='latex-math'>Na</span>) وذرة كلور (<span class='latex-math'>Cl</span>) في <span class='latex-math'>NaCl</span>؟",
        options: ["تساهمية", "أيونية", "فلزية", "هيدروجينية"],
        answer: "أيونية",
        explanation: "<span class='latex-math'>NaCl</span> (كلوريد الصوديوم) يتكون عندما تفقد ذرة الصوديوم إلكتروناً واحداً لتصبح أيوناً موجباً (<span class='latex-math'>Na<sup>+</sup></span>) وتكتسبه ذرة الكلور لتصبح أيوناً سالباً (<span class='latex-math'>Cl<sup>-</sup></span>). تجاذب الأيونات المتعاكسة الشحنة يشكل رابطة أيونية."
    },
    {
        question: "كم عدد مجموعات الهيدروكسيل (<span class='latex-math'>-OH</span>) في جزيء الجلسرول (الجلسرين)؟",
        options: ["1", "2", "3", "4"],
        answer: "3",
        explanation: "الجلسرول هو كحول ثلاثي الهيدروكسيل، أي أنه يحتوي على ثلاث مجموعات هيدروكسيل (<span class='latex-math'>-OH</span>) مرتبطة بثلاث ذرات كربون."
    },
    {
        question: "ما هو اسم العملية التي يتحول فيها الغاز مباشرة إلى مادة صلبة دون المرور بالحالة السائلة؟",
        options: ["التسامي", "التكثف", "التبخر", "الترسيب"],
        answer: "الترسيب",
        explanation: "الترسيب (Deposition) هو عملية فيزيائية يتحول فيها الغاز مباشرة إلى مادة صلبة، وهي عكس التسامي. مثال على ذلك تكون الصقيع من بخار الماء مباشرة."
    },
    {
        question: "ما هو الغاز الذي يشكل حوالي 21% من الغلاف الجوي للأرض وهو ضروري للاحتراق؟",
        options: ["النيتروجين", "ثاني أكسيد الكربون", "الأكسجين", "الأرجون"],
        answer: "الأكسجين",
        explanation: "الأكسجين (O<sub>2</sub>) يشكل حوالي 21% من الغلاف الجوي وهو غاز حيوي للتنفس والاحتراق."
    },
    {
        question: "ما هو المنتج الرئيسي لتفاعل حمض مع قاعدة؟",
        options: ["غاز", "ملح", "ماء", "ملح وماء"],
        answer: "ملح وماء",
        explanation: "تفاعل التعادل بين حمض وقاعدة ينتج عنه عادةً ملح وماء. على سبيل المثال، <span class='latex-math'>HCl + NaOH &rarr; NaCl + H<sub>2</sub>O</span>."
    },
    {
        question: "أي من المواد التالية هي بوليمر طبيعي؟",
        options: ["البولي إيثيلين", "النايلون", "البروتين", "البولي فينيل كلوريد"],
        answer: "البروتين",
        explanation: "البروتينات هي بوليمرات حيوية طبيعية تتكون من وحدات متكررة من الأحماض الأمينية. البولي إيثيلين، النايلون، والبولي فينيل كلوريد هي بوليمرات صناعية."
    },
    {
        question: "ما هو الحمض النووي الذي يحتوي على قاعدة الثايمين (<span class='latex-math'>T</span>) بدلاً من اليوراسيل (<span class='latex-math'>U</span>)؟",
        options: ["<span class='latex-math'>RNA</span>", "<span class='latex-math'>DNA</span>", "كلاهما", "لا شيء مما سبق"],
        answer: "<span class='latex-math'>DNA</span>",
        explanation: "الـ <span class='latex-math'>DNA</span> (الحمض النووي الريبوزي منقوص الأكسجين) يحتوي على القواعد النيتروجينية الأدينين (A)، الغوانين (G)، السايتوسين (C)، والثايمين (T). بينما الـ <span class='latex-math'>RNA</span> (الحمض النووي الريبوزي) يحتوي على اليوراسيل (U) بدلاً من الثايمين."
    },
    {
        question: "في الخلية الجلفانية، تحدث عملية الأكسدة عند ...",
        options: ["الكاثود", "الأنود", "القنطرة الملحية", "الإلكتروليت"],
        answer: "الأنود",
        explanation: "في الخلية الجلفانية (الخلايا الكهروكيميائية التي تنتج طاقة كهربائية)، تحدث الأكسدة (فقدان الإلكترونات) دائماً عند الأنود (القطب السالب)."
    },
    {
        question: "ما هو الرقم الهيدروجيني (<span class='latex-math'>pH</span>) للمحلول المتعادل عند درجة حرارة الغرفة؟",
        options: ["0", "7", "14", "أقل من 7"],
        answer: "7",
        explanation: "المحلول المتعادل (مثل الماء النقي) عند درجة حرارة 25 درجة مئوية يكون له رقم هيدروجيني (<span class='latex-math'>pH</span>) يساوي 7. المحاليل الأقل من 7 تكون حمضية، والأعلى من 7 تكون قاعدية."
    },
    {
        question: "مجموع الكتل الذرية لجميع الذرات في جزيء واحد يعرف بـ ...",
        options: ["الكتلة الذرية", "الكتلة المولية", "الكتلة الجزيئية", "العدد الكتلي"],
        answer: "الكتلة الجزيئية",
        explanation: "الكتلة الجزيئية (Molecular Mass) هي مجموع الكتل الذرية لجميع الذرات المكونة للجزيء. أما الكتلة المولية فهي كتلة مول واحد من المادة (غالباً بوحدة جرام/مول) وتساوي عددياً الكتلة الجزيئية أو الذرية أو الصيغية."
    },
    {
        question: "أي من الغازات النبيلة التالية يستخدم لملء المصابيح الكهربائية لمنع احتراق الفتيل؟",
        options: ["الهيليوم", "النيون", "الأرجون", "الكريبتون"],
        answer: "الأرجون",
        explanation: "الأرجون (Ar) هو الغاز النبيل الأكثر شيوعاً المستخدم في المصابيح المتوهجة (لمبات الإضاءة العادية) لأنه خامل كيميائياً ويمنع تأكسد الفتيل (عادةً من التنجستن) ويطيل عمره."
    },
    {
        question: "إذا كانت حرارة التفاعل لتكوين الماء من الهيدروجين والأكسجين هي <span class='latex-math'>\Delta H_1</span>، وحرارة التفاعل لتفكك الماء إلى مكوناته هي <span class='latex-math'>\Delta H_2</span>، فإن العلاقة الصحيحة هي:",
        options: ["<span class='latex-math'>\Delta H_1 = \Delta H_2</span>", "<span class='latex-math'>\Delta H_1 = -\Delta H_2</span>", "<span class='latex-math'>|\Delta H_1| > |\Delta H_2|</span>", "لا شيء مما سبق"],
        answer: "<span class='latex-math'>\Delta H_1 = -\Delta H_2</span>",
        explanation: "وفقاً لقانون هس (Hess's Law)، حرارة التفاعل العكسي هي نفسها حرارة التفاعل الأصلي ولكن بإشارة معاكسة. إذا كان التكوين طارداً للحرارة (بالسالب)، فالتفكك ماص للحرارة (بالموجب) وبنفس القيمة المطلقة."
    },
    {
        question: "ما هو المذيب الشائع الذي يعرف بـ 'المذيب الكوني' لقدرته على إذابة العديد من المواد؟",
        options: ["الإيثانول", "البنزين", "الماء", "الأسيتون"],
        answer: "الماء",
        explanation: "الماء (H<sub>2</sub>O) يُعرف بـ 'المذيب الكوني' بسبب قطبيته العالية وقدرته على تكوين روابط هيدروجينية، مما يجعله قادراً على إذابة مجموعة واسعة جداً من المواد الأيونية والقطبية."
    }
];

const questionsEnglish = [
    {
        question: "Choose the correct word to complete the sentence: 'She <span class='english'>___</span> to the store yesterday.'",
        options: ["<span class='english'>go</span>", "<span class='english'>goes</span>", "<span class='english'>went</span>", "<span class='english'>going</span>"],
        answer: "<span class='english'>went</span>",
        explanation: "The sentence uses 'yesterday,' indicating a past action. The past simple form of 'go' is 'went'."
    },
    {
        question: "What is the past participle of the verb '<span class='english'>eat</span>'?",
        options: ["<span class='english'>eat</span>", "<span class='english'>ate</span>", "<span class='english'>eaten</span>", "<span class='english'>eating</span>"],
        answer: "<span class='english'>eaten</span>",
        explanation: "The past participle of the irregular verb 'eat' is 'eaten'. It is often used with 'have' or 'has' in perfect tenses, e.g., 'I have eaten'."
    },
    {
        question: "Which of these is a synonym for '<span class='english'>happy</span>'?",
        options: ["<span class='english'>sad</span>", "<span class='english'>joyful</span>", "<span class='english'>angry</span>", "<span class='english'>tired</span>"],
        answer: "<span class='english'>joyful</span>",
        explanation: "'Joyful' means feeling, expressing, or causing great pleasure and happiness, making it a synonym for 'happy'."
    },
    {
        question: "Complete the sentence: 'If I <span class='english'>__</span> a bird, I would fly.'",
        options: ["<span class='english'>was</span>", "<span class='english'>were</span>", "<span class='english'>am</span>", "<span class='english'>is</span>"],
        answer: "<span class='english'>were</span>",
        explanation: "This is a second conditional sentence (hypothetical situation). In such sentences, 'were' is used for all subjects in the 'if' clause, even for singular subjects like 'I', 'he', 'she', 'it'."
    },
    {
        question: "What is the plural of '<span class='english'>child</span>'?",
        options: ["<span class='english'>childs</span>", "<span class='english'>children</span>", "<span class='english'>childes</span>", "<span class='english'>child's</span>"],
        answer: "<span class='english'>children</span>",
        explanation: "'Children' is the irregular plural form of 'child'. Many English nouns have irregular plural forms."
    },
    {
        question: "Choose the correct preposition: 'The book is <span class='english'>___</span> the table.'",
        options: ["<span class='english'>at</span>", "<span class='english'>in</span>", "<span class='english'>on</span>", "<span class='english'>by</span>"],
        answer: "<span class='english'>on</span>",
        explanation: "'On' is used when something is resting on the surface of another object, like a book on a table."
    },
    {
        question: "Which word means the opposite of '<span class='english'>expand</span>'?",
        options: ["<span class='english'>grow</span>", "<span class='english'>stretch</span>", "<span class='english'>contract</span>", "<span class='english'>enlarge</span>"],
        answer: "<span class='english'>contract</span>",
        explanation: "'Expand' means to become larger or more extensive. 'Contract' means to become smaller or shorter, thus it is the opposite."
    },
    {
        question: "Identify the adjective in the sentence: '<span class='english'>The quick brown fox jumps over the lazy dog.</span>'",
        options: ["<span class='english'>fox</span>", "<span class='english'>jumps</span>", "<span class='english'>quick</span>", "<span class='english'>over</span>"],
        answer: "<span class='english'>quick</span>",
        explanation: "An adjective describes a noun. In this sentence, 'quick' describes 'fox', and 'lazy' describes 'dog'. 'Quick' is one of the adjectives."
    },
    {
        question: "Complete the sentence: 'She speaks English <span class='english'>___</span>.'",
        options: ["<span class='english'>good</span>", "<span class='english'>well</span>", "<span class='english'>fluent</span>", "<span class='english'>bad</span>"],
        answer: "<span class='english'>well</span>",
        explanation: "'Well' is an adverb used to describe how someone speaks (an action verb). 'Good' is an adjective and describes nouns."
    },
    {
        question: "What is the full form of '<span class='english'>I'll</span>'?",
        options: ["<span class='english'>I will</span>", "<span class='english'>I shall</span>", "<span class='english'>I would</span>", "<span class='english'>I am</span>"],
        answer: "<span class='english'>I will</span>",
        explanation: "The contraction 'I'll' is most commonly a short form of 'I will'."
    }
];

// مصفوفة الأسئلة النشطة حالياً (سيتم ملؤها عند بدء الاختبار)
let activeQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let examTimer;
let timeLeft = 0; // في البداية 0
const EXAM_DURATION_SECONDS = 1500; // 25 دقائق لكل اختبار كمثال

// دالة بدء الاختبار
function startExam(subject) {
    switch (subject) {
        case 'أحياء':
            activeQuestions = [...questionsBiology]; // نسخ الأسئلة
            break;
        case 'كيمياء':
            activeQuestions = [...questionsChemistry];
            break;
        case 'إنجليزي':
            activeQuestions = [...questionsEnglish];
            break;
        default:
            alert('المادة غير موجودة!');
            return;
    }

    // خلط الأسئلة عشوائياً
    activeQuestions.sort(() => Math.random() - 0.5);

    currentQuestionIndex = 0;
    userAnswers = Array(activeQuestions.length).fill(null); // تهيئة إجابات المستخدم
    timeLeft = EXAM_DURATION_SECONDS; // إعادة ضبط المؤقت
    
    showScreen('examScreen');
    loadQuestion();
    startTimer();
}

// دالة تحميل السؤال الحالي
function loadQuestion() {
    if (activeQuestions.length === 0) {
        document.getElementById('questionText').innerText = "لا توجد أسئلة لهذه المادة.";
        document.getElementById('optionsContainer').innerHTML = '';
        return;
    }

    const questionData = activeQuestions[currentQuestionIndex];
    document.getElementById('questionText').innerHTML = `${currentQuestionIndex + 1}. ${questionData.question}`; // استخدم innerHTML لدعم span.english و .latex-math

    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = ''; // مسح الخيارات السابقة

    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-button');
        button.innerHTML = option; // استخدم innerHTML لدعم span.english و .latex-math
        button.onclick = () => selectOption(index);

        // إذا كان المستخدم قد أجاب على هذا السؤال، حدد خياره
        if (userAnswers[currentQuestionIndex] === option) {
            button.classList.add('selected');
        }
        optionsContainer.appendChild(button);
    });
}

// دالة اختيار إجابة
function selectOption(optionIndex) {
    const optionsContainer = document.getElementById('optionsContainer');
    const buttons = optionsContainer.querySelectorAll('.option-button');
    
    // إزالة التحديد من جميع الخيارات
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    // تحديد الخيار الذي تم النقر عليه
    buttons[optionIndex].classList.add('selected');
    
    // حفظ إجابة المستخدم (نص الخيار، وليس فقط الفهرس)
    userAnswers[currentQuestionIndex] = activeQuestions[currentQuestionIndex].options[optionIndex];
}

// دالة السؤال السابق
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    } else {
        alert('هذا هو السؤال الأول!');
    }
}

// دالة السؤال التالي
function nextQuestion() {
    if (currentQuestionIndex < activeQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        alert('هذا هو السؤال الأخير. يرجى إنهاء الاختبار.');
    }
}

// دالة بدء المؤقت
function startTimer() {
    clearInterval(examTimer); // مسح أي مؤقت سابق
    examTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('examTimer').innerText = `الوقت المتبقي: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(examTimer);
            alert('انتهى الوقت! سيتم إنهاء الاختبار تلقائياً.');
            endExam();
        }
        timeLeft--;
    }, 1000);
}

// دالة تأكيد إنهاء الاختبار
function confirmEndExam() {
    if (confirm('هل أنت متأكد أنك تريد إنهاء الاختبار؟')) {
        endExam();
    }
}

// دالة إنهاء الاختبار وعرض النتائج
function endExam() {
    clearInterval(examTimer); // إيقاف المؤقت
    calculateResults();
    showScreen('resultsScreen');
}

// دالة حساب النتائج وعرض المراجعة
function calculateResults() {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const reviewContainer = document.getElementById('reviewContainer');
    reviewContainer.innerHTML = ''; // مسح المراجعات القديمة

    activeQuestions.forEach((q, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = q.answer;
        const explanation = q.explanation || "لا يوجد شرح متاح لهذا السؤال."; // استخدم شرح افتراضي إذا لم يكن موجوداً

        const questionReviewDiv = document.createElement('div');
        questionReviewDiv.classList.add('question-review-item');
        
        let answerStatusClass = '';
        let answerDisplay = '';

        if (userAnswer === correctAnswer) {
            correctCount++;
            answerStatusClass = 'correct';
            answerDisplay = userAnswer;
        } else if (userAnswer !== null) {
            incorrectCount++;
            answerStatusClass = 'incorrect';
            answerDisplay = userAnswer;
            questionReviewDiv.classList.add('wrong'); // لتلوين خلفية السؤال الخاطئ
        } else {
            unansweredCount++;
            answerStatusClass = 'unanswered';
            answerDisplay = 'لم تجب';
            questionReviewDiv.classList.add('unanswered'); // لتلوين خلفية السؤال غير المجاب
        }

        questionReviewDiv.innerHTML = `
            <p class="review-text"><strong>السؤال ${index + 1}:</strong> ${q.question}</p>
            <p class="review-text">إجابتك: <span class="${answerStatusClass}">${answerDisplay}</span></p>
            <p class="review-text">الإجابة الصحيحة: <span class="correct">${correctAnswer}</span></p>
            <div class="explanation-text">
                <strong>الشرح:</strong> <span class="explanation-content">${explanation}</span>
            </div>
        `;
        reviewContainer.appendChild(questionReviewDiv);
    });

    const totalQuestions = activeQuestions.length;
    const scorePercentage = totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(2) + '%' : '0%';

    document.getElementById('scorePercentage').innerText = scorePercentage;
    document.getElementById('correctAnswersCount').innerText = correctCount;
    document.getElementById('incorrectAnswersCount').innerText = incorrectCount;
    document.getElementById('unansweredQuestionsCount').innerText = unansweredCount;
}

// Initialize the first screen and the testimonials slider on load
document.addEventListener('DOMContentLoaded', () => {
    showScreen('mainScreen');
    initializeTestimonialsSlider(); // تهيئة السلايدر بعد تحميل DOM بالكامل
});

// لتحديث حجم السلايدر عند تغيير حجم الشاشة (مهم للتجاوبية)
window.addEventListener('resize', () => {
    if (testimonialSlider) {
        showTestimonial(currentTestimonialIndex); // إعادة ضبط موضع السلايدر
    }
});
