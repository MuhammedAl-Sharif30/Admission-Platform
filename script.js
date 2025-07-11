        // --- Screen Management Logic ---
        let currentSubject = null;
        let currentGrade = null;
        let currentChapter = null;
        let activeQuestions = []; // الأسئلة النشطة للاختبار الحالي
        let currentQuestionIndex = 0;
        let userAnswers = [];
        let examTimer;
        let timeLeft = 0;
        const EXAM_DURATION_SECONDS = 1500; // 25 دقائق لكل اختبار (يمكن تعديله)

        // لتتبع الشاشة السابقة لزر العودة
        let previousScreenStack = [];

        function showScreen(screenId) { 
            console.log('Attempting to show screen:', screenId);
            
            // Push current active screen to stack before changing, if it's not the same screen
            const currentActiveScreen = document.querySelector('.screen.active');
            if (currentActiveScreen && currentActiveScreen.id !== screenId) {
                // Avoid pushing examScreen or resultsScreen multiple times if navigating within exam
                if (!['examScreen', 'resultsScreen'].includes(screenId) || !['examScreen', 'resultsScreen'].includes(currentActiveScreen.id)) {
                     previousScreenStack.push(currentActiveScreen.id);
                     console.log('Pushed to stack:', currentActiveScreen.id, 'Stack:', previousScreenStack);
                }
            }
            
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
                // خاصية: "الامتحانات التجريبية" تكون نشطة إذا كنا في أي من شاشات الامتحانات أو شاشاتها الفرعية
                if (['examsOverviewScreen', 'subjectExamOptionsScreen', 'subjectComprehensiveExamsScreen', 'gradesSelectionScreen', 'gradeExamOptionsScreen', 'gradeComprehensiveExamScreen', 'chaptersSelectionScreen', 'chapterExamsSelectionScreen', 'examScreen', 'resultsScreen'].includes(screenId) && link.getAttribute('data-screen-id') === 'examsOverviewScreen') {
                    link.classList.add('active');
                } else if (link.getAttribute('data-screen-id') === screenId) {
                    link.classList.add('active');
                }
            });

            // إدارة الـ "active" class في شريط التنقل السفلي (للشاشات الصغيرة)
            const bottomNavItems = document.querySelectorAll('.bottom-nav-bar .bottom-nav-item');
            bottomNavItems.forEach(item => {
                item.classList.remove('active');
                // خاصية: "الامتحانات" تكون نشطة إذا كنا في أي من شاشات الامتحانات أو شاشاتها الفرعية
                if (['examsOverviewScreen', 'subjectExamOptionsScreen', 'subjectComprehensiveExamsScreen', 'gradesSelectionScreen', 'gradeExamOptionsScreen', 'gradeComprehensiveExamScreen', 'chaptersSelectionScreen', 'chapterExamsSelectionScreen', 'examScreen', 'resultsScreen'].includes(screenId) && item.getAttribute('data-screen-id') === 'examsOverviewScreen') {
                    item.classList.add('active');
                } else if (item.getAttribute('data-screen-id') === screenId) {
                    item.classList.add('active');
                }
            });

            // إدارة الـ "active" class في القائمة الجانبية (للشاشات الصغيرة)
            const sidebarLinks = document.querySelectorAll('.sidebar-link');
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                // خاصية: "الامتحانات التجريبية" تكون نشطة إذا كنا في أي من شاشات الامتحانات أو شاشاتها الفرعية
                if (['examsOverviewScreen', 'subjectExamOptionsScreen', 'subjectComprehensiveExamsScreen', 'gradesSelectionScreen', 'gradeExamOptionsScreen', 'gradeComprehensiveExamScreen', 'chaptersSelectionScreen', 'chapterExamsSelectionScreen', 'examScreen', 'resultsScreen'].includes(screenId) && link.getAttribute('data-screen-id') === 'examsOverviewScreen') {
                    link.classList.add('active');
                } else if (link.getAttribute('data-screen-id') === screenId) {
                    link.classList.add('active');
                }
            });
        }

        // دالة العودة للشاشة السابقة من الستاك
        function showPreviousScreen() {
            if (previousScreenStack.length > 0) {
                const prevScreenId = previousScreenStack.pop();
                console.log('Popped from stack:', prevScreenId, 'Stack:', previousScreenStack);
                showScreen(prevScreenId);
            } else {
                // إذا لم يكن هناك شاشة سابقة في الستاك، العودة للشاشة الرئيسية
                showScreen('mainScreen');
            }
        }

        // دالة خاصة لزر العودة في شاشات الاختبار والنتائج، لأنها قد تكون وصلت إليها من مسارات متعددة
        function showPreviousExamScreen() {
            // اعتمادًا على من أين جئت إلى شاشة الاختبار، يمكنك تحديد الوجهة
            // هذه منطق بسيط: إذا كان currentChapter موجودًا، فارجع إلى شاشة اختبارات الفصل
            // وإلا، ارجع إلى شاشة الاختبارات الشاملة للمادة أو الصف.
            // يمكنك تعقيد هذا المنطق أكثر إذا احتجت لتتبع المسارات بدقة أكبر.
            if (currentChapter) {
                showChapterExamsSelection(currentSubject, currentGrade, currentChapter);
            } else if (currentGrade) { // إذا كنا في اختبار شامل للصف
                showGradeComprehensiveExam(currentSubject, currentGrade);
            } else { // إذا كنا في اختبار شامل للمادة
                showComprehensiveExams(currentSubject);
            }
        }


        // --- Sidebar Logic ---
        function openSidebar() {
            document.getElementById("sidebar").classList.add("open");
            document.querySelector(".overlay").classList.add("active");
        }

        function closeSidebar() {
            document.getElementById("sidebar").classList.remove("open");
            document.querySelector(".overlay").classList.add("active"); // Keep overlay active to dim background
            document.querySelector(".overlay").classList.remove("active"); // Remove active class to hide it again
        }

        // --- WhatsApp Function ---
        function openWhatsApp() {
            const phoneNumber = '+967776575356'; // رقم واتساب محمد الشريف مع رمز الدولة
            const message = encodeURIComponent('أهلاً، أود الاستفسار عن منصة القبول الطبي - اليمن.');
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank'); // استخدام _blank لفتح في تبويبة جديدة
        }

        // --- Exam Data Structures ---
        // بيانات المواد الرئيسية لـ ExamsOverviewScreen
        const subjectsData = {
            'أحياء': {
                icon: 'fas fa-dna',
                description: 'شروحات مفصلة، ملخصات، وأسئلة تدريبية في جميع فصول الأحياء.'
            },
            'كيمياء': {
                icon: 'fas fa-atom',
                description: 'شروحات وافية للتفاعلات، المعادلات، والعناصر الكيميائية الهامة.'
            },
            'إنجليزي': {
                icon: 'fas fa-language',
                description: 'عزز مهاراتك في اللغة الإنجليزية مع نماذج متنوعة.'
            }
        };

        // هيكل بيانات الاختبارات الشاملة لكل مادة
        const comprehensiveExamsData = {
            'أحياء': [
                {
                    id: 'bio_comp_1',
                    name: 'اختبار الأحياء الشامل 1',
                    type: 'مجاني',
                    questions: [
                        { question: "توجد صبغة الكلوروفيل في خلايا بعض الكائنات مثل ...", options: ["الفطريات", "البكتيريا", "النخيل", "البراميسيوم"], answer: "النخيل", explanation: "الكلوروفيل هي الصبغة الخضراء المسؤولة عن عملية البناء الضوئي، وتوجد بشكل أساسي في النباتات والطحالب وبعض أنواع البكتيريا. من بين الخيارات المعطاة، النخيل هو نبات ويحتوي على الكلوروفيل. الفطريات والبراميسيوم كائنات غير ذاتية التغذية لا تحتوي على الكلوروفيل. بعض أنواع البكتيريا تقوم بالبناء الضوئي لكن السؤال يركز على كائنات تحتوي الكلوروفيل بشكل عام." },
                        { question: "تمر الخلايا المرستيمية بــ.....", options: ["جميع مراحل دورة الخلية", "بعض مراحل دورة الخلية", "طور السبات", "ليس مما سبق"], answer: "جميع مراحل دورة الخلية", explanation: "الخلايا المرستيمية هي خلايا نباتية غير متخصصة تتميز بقدرتها المستمرة على الانقسام. وللقيام بالانقسام، يجب أن تمر بجميع مراحل دورة الخلية (الطور البيني الذي يشمل G1, S, G2، والطور الانقسامي M)." },
                        { question: "تتم تفاعلات دورة كالفن في...", options: ["السيتوبلازم", "البلاستيدات", "النواة", "الميتوكوندريا"], answer: "البلاستيدات", explanation: "دورة كالفن (التفاعلات اللاضوئية للبناء الضوئي) تتم في لحمة (Stroma) البلاستيدات الخضراء، وهي الجزء السائل داخل البلاستيدة." },
                        // TODO: أضف المزيد من الأسئلة لاختبار الأحياء الشامل 1
                    ]
                },
                {
                    id: 'bio_comp_2',
                    name: 'اختبار الأحياء الشامل 2',
                    type: 'مدفوع',
                    questions: [
                        { question: "أي من التالي ليس جزءًا من الجهاز الهضمي؟", options: ["المعدة", "القلب", "الأمعاء الدقيقة", "القولون"], answer: "القلب", explanation: "القلب هو جزء من الجهاز الدوري وليس الجهاز الهضمي." },
                        { question: "ما هو اسم العملية التي تنتج فيها النباتات الغذاء باستخدام ضوء الشمس؟", options: ["التنفس", "التخمر", "البناء الضوئي", "النتح"], answer: "البناء الضوئي", explanation: "البناء الضوئي (Photosynthesis) هي العملية التي تقوم بها النباتات والطحالب وبعض البكتيريا لتحويل الطاقة الضوئية إلى طاقة كيميائية (غذاء)." },
                        // TODO: أضف المزيد من الأسئلة لاختبار الأحياء الشامل 2
                    ]
                }
                // TODO: أضف هنا المزيد من الاختبارات الشاملة للأحياء (مجانية/مدفوعة)
            ],
            'كيمياء': [
                {
                    id: 'chem_comp_1',
                    name: 'اختبار الكيمياء الشامل 1',
                    type: 'مجاني',
                    questions: [
                        { question: "ما هو العنصر الذي يمتلك أعلى كهرسالبية في الجدول الدوري؟", options: ["الأكسجين", "النيتروجين", "الفلور", "الكلور"], answer: "الفلور", explanation: "الفلور (F) يقع في أعلى يمين الجدول الدوري (باستثناء الغازات النبيلة) ويمتلك أعلى كهرسالبية (قدرة الذرة على جذب الإلكترونات في الرابطة الكيميائية) بقيمة 3.98 على مقياس باولنغ." },
                        { question: "ما نوع الرابطة المتكونة بين ذرة صوديوم (<span class='latex-math'>Na</span>) وذرة كلور (<span class='latex-math'>Cl</span>) في <span class='latex-math'>NaCl</span>؟", options: ["تساهمية", "أيونية", "فلزية", "هيدروجينية"], answer: "أيونية", explanation: "<span class='latex-math'>NaCl</span> (كلوريد الصوديوم) يتكون عندما تفقد ذرة الصوديوم إلكتروناً واحداً لتصبح أيوناً موجباً (<span class='latex-math'>Na<sup>+</sup></span>) وتكتسبه ذرة الكلور لتصبح أيوناً سالباً (<span class='latex-math'>Cl<sup>-</sup></span>). تجاذب الأيونات المتعاكسة الشحنة يشكل رابطة أيونية." },
                        // TODO: أضف المزيد من الأسئلة لاختبار الكيمياء الشامل 1
                    ]
                }
                // TODO: أضف هنا المزيد من الاختبارات الشاملة للكيمياء
            ],
            'إنجليزي': [
                {
                    id: 'eng_comp_1',
                    name: 'اختبار الإنجليزية الشامل 1',
                    type: 'مجاني',
                    questions: [
                        { question: "Choose the correct word: 'She <span class='english'>___</span> to school every day.'", options: ["<span class='english'>go</span>", "<span class='english'>goes</span>", "<span class='english'>went</span>", "<span class='english'>going</span>"], answer: "<span class='english'>goes</span>", explanation: "For third person singular (she, he, it) in present simple tense, we add -es or -s to the verb." },
                        { question: "What is the opposite of '<span class='english'>hot</span>'?", options: ["<span class='english'>warm</span>", "<span class='english'>cold</span>", "<span class='english'>lukewarm</span>", "<span class='english'>boiling</span>"], answer: "<span class='english'>cold</span>", explanation: "'Cold' is the direct opposite of 'hot'." },
                        // TODO: أضف المزيد من الأسئلة لاختبار الإنجليزية الشامل 1
                    ]
                }
                // TODO: أضف هنا المزيد من الاختبارات الشاملة للإنجليزية
            ]
        };

        // هيكل بيانات الاختبارات الشاملة لكل صف داخل كل مادة
        const gradeComprehensiveExamsData = {
            'أحياء': {
                'الأول الثانوي': [
                    {
                        id: 'bio_grade1_comp_1',
                        name: 'اختبار أحياء شامل 1 للأول الثانوي',
                        type: 'مجاني',
                        questions: [
                            { question: "ما هو السكر الموجود في الدم؟", options: ["الفركتوز", "الجلوكوز", "السكروز", "المالتوز"], answer: "الجلوكوز", explanation: "الجلوكوز هو السكر الرئيسي في الدم ومصدر الطاقة الأساسي للخلايا." },
                            { question: "ما هي الوحدة البنائية الأساسية للحياة؟", options: ["الجزيء", "الخلية", "النسيج", "العضو"], answer: "الخلية", explanation: "الخلية هي الوحدة التركيبية والوظيفية الأساسية لجميع الكائنات الحية." }
                            // TODO: أضف أسئلة اختبار شامل 1 للأول الثانوي أحياء
                        ]
                    }
                    // TODO: أضف المزيد من الاختبارات الشاملة للصف الأول الثانوي أحياء
                ],
                'الثاني الثانوي': [
                    // TODO: أضف هنا اختبارات شاملة للصف الثاني الثانوي أحياء
                ],
                'الثالث الثانوي': [
                    // TODO: أضف هنا اختبارات شاملة للصف الثالث الثانوي أحياء
                ]
            },
            'كيمياء': {
                'الأول الثانوي': [
                    {
                        id: 'chem_grade1_comp_1',
                        name: 'اختبار كيمياء شامل 1 للأول الثانوي',
                        type: 'مجاني',
                        questions: [
                            { question: "رمز الماء الكيميائي هو...", options: ["<span class='latex-math'>CO<sub>2</sub></span>", "<span class='latex-math'>H<sub>2</sub>O</span>", "<span class='latex-math'>O<sub>2</sub></span>", "<span class='latex-math'>NaCl</span>"], answer: "<span class='latex-math'>H<sub>2</sub>O</span>", explanation: "الماء يتكون من ذرتي هيدروجين وذرة أكسجين." },
                            { question: "كم عدد البروتونات في ذرة الأكسجين (العدد الذري 8)؟", options: ["6", "8", "10", "16"], answer: "8", explanation: "العدد الذري للعنصر يمثل عدد البروتونات في نواته، وللأكسجين هو 8." }
                            // TODO: أضف أسئلة اختبار شامل 1 للأول الثانوي كيمياء
                        ]
                    }
                ],
                'الثاني الثانوي': [],
                'الثالث الثانوي': []
            },
            'إنجليزي': {
                'الأول الثانوي': [
                    {
                        id: 'eng_grade1_comp_1',
                        name: 'اختبار إنجليزي شامل 1 للأول الثانوي',
                        type: 'مجاني',
                        questions: [
                            { question: "What is the plural of 'mouse'?", options: ["mouses", "mice", "mouse's", "mouse'es"], answer: "mice", explanation: "'Mice' is the irregular plural form of 'mouse'." },
                            { question: "Choose the correct preposition: 'He is good <span class='english'>___</span> drawing.'", options: ["in", "at", "on", "for"], answer: "at", explanation: "The correct preposition to use with 'good' when referring to a skill or activity is 'at'." }
                            // TODO: أضف أسئلة اختبار شامل 1 للأول الثانوي إنجليزي
                        ]
                    }
                ],
                'الثاني الثانوي': [],
                'الثالث الثانوي': []
            }
        };

        // هيكل بيانات الاختبارات حسب الفصول داخل كل صف لكل مادة
        const examData = { // تمت إعادة تسميته ليصبح `chapterExamsData` منطقياً، لكن تركته `examData` للتوافق
            'أحياء': {
                'الأول الثانوي': {
                    'الفصل الأول: الكيمياء الحيوية': [
                        {
                            id: 'bio_g1_c1_exam1',
                            name: 'اختبار الفصل الأول - الكيمياء الحيوية 1',
                            type: 'مجاني',
                            questions: [
                                { question: "توجد صبغة الكلوروفيل في خلايا بعض الكائنات مثل ...", options: ["الفطريات", "البكتيريا", "النخيل", "البراميسيوم"], answer: "النخيل", explanation: "الكلوروفيل هي الصبغة الخضراء المسؤولة عن عملية البناء الضوئي، وتوجد بشكل أساسي في النباتات والطحالب وبعض أنواع البكتيريا. من بين الخيارات المعطاة، النخيل هو نبات ويحتوي على الكلوروفيل. الفطريات والبراميسيوم كائنات غير ذاتية التغذية لا تحتوي على الكلوروفيل. بعض أنواع البكتيريا تقوم بالبناء الضوئي لكن السؤال يركز على كائنات تحتوي الكلوروفيل بشكل عام." },
                                { question: "تمر الخلايا المرستيمية بــ.....", options: ["جميع مراحل دورة الخلية", "بعض مراحل دورة الخلية", "طور السبات", "ليس مما سبق"], answer: "جميع مراحل دورة الخلية", explanation: "الخلايا المرستيمية هي خلايا نباتية غير متخصصة تتميز بقدرتها المستمرة على الانقسام. وللقيام بالانقسام، يجب أن تمر بجميع مراحل دورة الخلية (الطور البيني الذي يشمل G1, S, G2، والطور الانقسامي M)." }
                                // TODO: أضف المزيد من الأسئلة لاختبار الفصل الأول أحياء 1 ثانوي
                            ]
                        },
                        {
                            id: 'bio_g1_c1_exam2',
                            name: 'اختبار الفصل الأول - الكيمياء الحيوية 2',
                            type: 'مدفوع',
                            questions: [
                                { question: "ما هو المكون الرئيسي لجدران الخلايا النباتية؟", options: ["البروتين", "الدهون", "السليلوز", "الكايتين"], answer: "السليلوز", explanation: "السليلوز هو بوليمر كبير من الجلوكوز وهو المكون الأساسي لجدران الخلايا النباتية، مما يوفر الدعم الهيكلي." },
                                { question: "أي من المركبات التالية هو سكر ثنائي؟", options: ["الجلوكوز", "الفركتوز", "السكروز", "النشا"], answer: "السكروز", explanation: "السكروز هو سكر ثنائي يتكون من ارتباط الجلوكوز والفركتوز. الجلوكوز والفركتوز سكريات أحادية، والنشا بوليمر عديد السكاريد." }
                                // TODO: أضف المزيد من الأسئلة لاختبار الفصل الأول أحياء 1 ثانوي 2 (مدفوع)
                            ]
                        }
                    ],
                    'الفصل الثاني: التصنيف والتنوع الحيوي': [
                        {
                            id: 'bio_g1_c2_exam1',
                            name: 'اختبار الفصل الثاني - التصنيف 1',
                            type: 'مجاني',
                            questions: [
                                { question: "في نبات الفيوناريا يتكون من القدم وشبه الساق والعنق والعلبة", options: ["المشيج المذكر", "النسيج المؤنث", "النبات البوغي", "النبات المشيجي"], answer: "النبات البوغي", explanation: "نبات الفيوناريا (من الحزازيات) يمر بدورة حياة تتناوب فيها الأجيال. النبات البوغي (Sporophyte) هو الجيل الذي ينتج الأبواغ، ويتكون من قدم (تتصل بالنبات المشيجي)، وعنق، وعلبة (حافظة الأبواغ)." },
                                { question: "ظاهرة تبادل الأجيال تحدث في ...", options: ["البراميسيوم", "الأميبا", "البلاناريا", "بلازموديوم الملاريا"], answer: "بلازموديوم الملاريا", explanation: "تبادل الأجيال (Alternation of Generations) هو ظاهرة تتضمن تعاقب جيل جنسي وجيل لاجنسي في دورة حياة الكائن الحي. بلازموديوم الملاريا (Plasmodium falciparum) يمتلك دورة حياة معقدة تتضمن مراحل جنسية ولاجنسية داخل مضيفين مختلفين (الإنسان والبعوض)، مما يمثل تبادل أجيال." }
                                // TODO: أضف المزيد من الأسئلة لاختبار الفصل الثاني أحياء 1 ثانوي
                            ]
                        }
                    ]
                },
                'الثاني الثانوي': {
                    'الفصل الأول: الوراثة والجينات': [
                        {
                            id: 'bio_g2_c1_exam1',
                            name: 'اختبار الوراثة والجينات 1',
                            type: 'مجاني',
                            questions: [
                                { question: "أحد الصفات الآتية لم يقم مندل بدراستها", options: ["لون الزهرة", "لون الساق", "لون البذرة", "لون القرن"], answer: "لون الساق", explanation: "قام مندل بدراسة سبع صفات في نبات البازلاء، وهي: طول الساق، شكل البذرة، لون البذرة، شكل القرن، لون القرن، لون الزهرة، وموقع الزهرة. لم يدرس 'لون الساق' كصفة مستقلة." },
                                { question: "في الخطوة الثالثة من بناء البروتين يلتقي حمض..... مع حمض <span class='latex-math'>RNA</span> الناقل حيث يقوم الناقل بقراءة شفرته", options: ["<span class='latex-math'>mRNA</span>", "<span class='latex-math'>tRNA</span>", "<span class='latex-math'>rRNA</span>", "لا شيء مما سبق"], answer: "<span class='latex-math'>mRNA</span>", explanation: "في عملية بناء البروتين (الترجمة)، يحمل حمض <span class='latex-math'>mRNA</span> (الرنا الرسول) الشفرة الوراثية من النواة إلى الريبوسومات. حمض <span class='latex-math'>tRNA</span> (الرنا الناقل) يحمل الحمض الأميني المحدد ويقوم 'بقراءة' الشفرة الموجودة على <span class='latex-math'>mRNA</span> (عن طريق مضاد الكودون) ويلتقي به عند الريبوسوم. لذا، الـ <span class='latex-math'>tRNA</span> يلتقي مع الـ <span class='latex-math'>mRNA</span>." }
                            ]
                        }
                    ]
                }
                // TODO: أضف هنا الفصول والاختبارات للصف الثاني/الثالث الثانوي أحياء
            },
            'كيمياء': {
                'الأول الثانوي': {
                    'الفصل الأول: أساسيات الكيمياء': [
                        {
                            id: 'chem_g1_c1_exam1',
                            name: 'اختبار أساسيات الكيمياء 1',
                            type: 'مجاني',
                            questions: [
                                { question: "ما هو العنصر الذي يمتلك أعلى كهرسالبية في الجدول الدوري؟", options: ["الأكسجين", "النيتروجين", "الفلور", "الكلور"], answer: "الفلور", explanation: "الفلور (F) يقع في أعلى يمين الجدول الدوري (باستثناء الغازات النبيلة) ويمتلك أعلى كهرسالبية (قدرة الذرة على جذب الإلكترونات في الرابطة الكيميائية) بقيمة 3.98 على مقياس باولنغ." }
                            ]
                        }
                    ]
                }
                // TODO: أضف هنا الفصول والاختبارات للصفوف والمواد الأخرى
            },
            'إنجليزي': {
                'المستوى الأول': { // يمكن تغيير "الأول الثانوي" إلى "المستوى الأول" أو أي تسمية تفضلها
                    'الفصل الأول: قواعد أساسية': [
                        {
                            id: 'eng_l1_c1_exam1',
                            name: 'اختبار القواعد الأساسية 1',
                            type: 'مجاني',
                            questions: [
                                { question: "Choose the correct word to complete the sentence: 'She <span class='english'>___</span> to the store yesterday.'", options: ["<span class='english'>go</span>", "<span class='english'>goes</span>", "<span class='english'>went</span>", "<span class='english'>going</span>"], answer: "<span class='english'>went</span>", explanation: "The sentence uses 'yesterday,' indicating a past action. The past simple form of 'go' is 'went'." }
                            ]
                        }
                    ]
                }
            }
        };


        // --- Exam Navigation Functions ---

        // شاشة اختيار المواد (أحياء، كيمياء، إنجليزي)
        function showExamsOverview() {
            previousScreenStack = []; // Reset stack when going to overview
            const container = document.getElementById('subjectCardsContainer');
            container.innerHTML = ''; 

            for (const subjectName in subjectsData) {
                const subjectInfo = subjectsData[subjectName];
                const card = document.createElement('div');
                card.classList.add('card');
                card.onclick = () => showSubjectExamOptions(subjectName); // تغيير الوجهة هنا
                card.innerHTML = `
                    <div class="card-icon"><i class="${subjectInfo.icon}"></i></div>
                    <div class="card-content">
                        <h3 class="card-title">اختبارات ${subjectName}</h3>
                        <p class="card-description">${subjectInfo.description}</p>
                        <button class="card-button">اختر</button>
                    </div>
                `;
                container.appendChild(card);
            }
            showScreen('examsOverviewScreen');
        }

        // شاشة خيارات الاختبار للمادة (شاملة، حسب الصف، قريباً) - NEW SCREEN
        function showSubjectExamOptions(subject) {
            currentSubject = subject;
            const titleElement = document.getElementById('subjectOptionsTitle');
            titleElement.innerText = `اختبارات ${subject}`;

            const container = document.getElementById('subjectOptionsContainer');
            container.innerHTML = '';

            // الخيار 1: اختبارات شاملة للمادة
            const comprehensiveCard = document.createElement('div');
            comprehensiveCard.classList.add('subject-option-card', 'comprehensive');
            comprehensiveCard.onclick = () => showComprehensiveExams(subject);
            comprehensiveCard.innerHTML = `
                <div class="icon-wrapper"><i class="fas fa-certificate"></i></div>
                <h3>اختبارات ${subject} الشاملة</h3>
                <p>اختبارات تغطي كامل المنهج للمراجعة النهائية.</p>
                <button class="card-button" style="background-color: var(--card-color-1);">عرض الاختبارات</button>
            `;
            container.appendChild(comprehensiveCard);

            // الخيار 2: اختبارات حسب الصف
            const byGradeCard = document.createElement('div');
            byGradeCard.classList.add('subject-option-card', 'by-grade');
            byGradeCard.onclick = () => showGrades(subject); // ستؤدي إلى شاشة الصفوف
            byGradeCard.innerHTML = `
                <div class="icon-wrapper"><i class="fas fa-user-graduate"></i></div>
                <h3>اختبارات ${subject} حسب الصف</h3>
                <p>اختر صفك الدراسي لخوض الاختبارات المناسبة.</p>
                <button class="card-button" style="background-color: var(--card-color-2);">اختر الصف</button>
            `;
            container.appendChild(byGradeCard);

            // الخيار 3: قريباً
            const comingSoonCard = document.createElement('div');
            comingSoonCard.classList.add('subject-option-card', 'soon', 'disabled');
            comingSoonCard.onclick = () => alert('هذه الخاصية قريباً جداً!'); // يمكن إزالة الـ onclick إذا كان معطلاً تماماً
            comingSoonCard.innerHTML = `
                <div class="icon-wrapper"><i class="fas fa-hourglass-half"></i></div>
                <h3>قريباً...</h3>
                <p>محتوى إضافي وميزات جديدة قادمة قريباً.</p>
                <button class="card-button disabled" style="background-color: var(--card-color-3);">انتظرونا</button>
            `;
            container.appendChild(comingSoonCard);

            showScreen('subjectExamOptionsScreen');
        }

        // شاشة قائمة الاختبارات الشاملة للمادة - NEW SCREEN
        function showComprehensiveExams(subject = currentSubject) {
            currentSubject = subject;
            const titleElement = document.getElementById('comprehensiveExamsTitle');
            titleElement.innerText = `اختبارات ${subject} الشاملة`;

            const container = document.getElementById('comprehensiveExamsContainer');
            container.innerHTML = '';

            const exams = comprehensiveExamsData[currentSubject] || [];

            if (exams.length === 0) {
                container.innerHTML = `<p class="section-title">لا توجد اختبارات شاملة لـ ${currentSubject} حالياً.</p>`;
                showScreen('subjectComprehensiveExamsScreen');
                return;
            }

            exams.forEach(exam => {
                const examCard = document.createElement('div');
                examCard.classList.add('exam-listing-card');
                if (exam.type === 'مدفوع') {
                    examCard.classList.add('disabled');
                }
                examCard.innerHTML = `
                    <div class="exam-listing-card-info">
                        <h3>${exam.name}</h3>
                        <p>عدد الأسئلة: ${exam.questions.length}</p>
                    </div>
                    <div class="exam-listing-card-actions">
                        <span class="status-badge ${exam.type === 'مجاني' ? 'free' : 'paid'}">${exam.type}</span>
                        <button class="start-button" onclick="startExam('${exam.id}', 'comprehensive')">ابدأ الاختبار</button>
                    </div>
                `;
                container.appendChild(examCard);
            });
            showScreen('subjectComprehensiveExamsScreen');
        }


        // شاشة اختيار الصفوف (تسمى من "اختبارات حسب الصف")
        function showGrades(subject = currentSubject) {
            currentSubject = subject; // Save current subject
            const container = document.getElementById('gradeCardsContainer');
            container.innerHTML = ''; // Clear previous content

            const subjectGrades = examData[currentSubject];
            if (!subjectGrades || Object.keys(subjectGrades).length === 0) {
                container.innerHTML = `<p class="section-title">لا توجد مستويات متاحة لـ ${currentSubject} حالياً.</p>`;
                showScreen('gradesSelectionScreen');
                return;
            }

            for (const gradeName in subjectGrades) {
                const card = document.createElement('div');
                card.classList.add('card', 'grade-card'); // إضافة كلاس جديد grade-card
                card.onclick = () => showGradeExamOptions(currentSubject, gradeName); // تغيير الوجهة هنا
                card.innerHTML = `
                    <div class="card-icon"><i class="fas fa-university"></i></div>
                    <div class="card-content">
                        <h3 class="card-title">${gradeName}</h3>
                        <p class="card-description">استكشف الفصول والاختبارات المتاحة لهذا المستوى.</p>
                        <button class="card-button">اختر الصف</button>
                    </div>
                `;
                container.appendChild(card);
            }
            showScreen('gradesSelectionScreen');
        }

        // شاشة خيارات الاختبار للصف (شاملة، حسب الفصول) - NEW SCREEN
        function showGradeExamOptions(subject = currentSubject, grade = currentGrade) {
            currentSubject = subject;
            currentGrade = grade;
            const titleElement = document.getElementById('gradeOptionsTitle');
            titleElement.innerText = `اختبارات ${subject} - ${grade}`;

            const container = document.getElementById('gradeOptionsContainer');
            container.innerHTML = '';

            // الخيار الفرعي الأول: اختبار شامل للصف
            const comprehensiveGradeCard = document.createElement('div');
            comprehensiveGradeCard.classList.add('grade-option-card', 'comprehensive-grade');
            comprehensiveGradeCard.onclick = () => showGradeComprehensiveExam(subject, grade);
            comprehensiveGradeCard.innerHTML = `
                <div class="icon-wrapper"><i class="fas fa-award"></i></div>
                <h3>اختبار شامل لمادة ${subject} للصف ${grade}</h3>
                <p>اختبر معلوماتك في المنهج كاملاً لهذا الصف.</p>
                <button class="card-button" style="background-color: var(--card-color-4);">عرض الاختبارات</button>
            `;
            container.appendChild(comprehensiveGradeCard);

            // الخيار الفرعي الثاني: اختبارات حسب الفصول
            const byChapterCard = document.createElement('div');
            byChapterCard.classList.add('grade-option-card', 'by-chapter');
            byChapterCard.onclick = () => showChapters(subject, grade); // ستؤدي إلى شاشة الفصول
            byChapterCard.innerHTML = `
                <div class="icon-wrapper"><i class="fas fa-book-open"></i></div>
                <h3>اختبارات ${subject} حسب الفصول</h3>
                <p>خوض اختبارات مركزة لكل فصل دراسي على حدة.</p>
                <button class="card-button" style="background-color: var(--card-color-5);">اختر الفصل</button>
            `;
            container.appendChild(byChapterCard);

            showScreen('gradeExamOptionsScreen');
        }

        // شاشة قائمة الاختبارات الشاملة للصف - NEW SCREEN
        function showGradeComprehensiveExam(subject = currentSubject, grade = currentGrade) {
            currentSubject = subject;
            currentGrade = grade;
            const titleElement = document.getElementById('gradeComprehensiveExamTitle');
            titleElement.innerText = `اختبار شامل ${subject} للصف ${grade}`;

            const container = document.getElementById('gradeComprehensiveExamContainer');
            container.innerHTML = '';

            const exams = gradeComprehensiveExamsData[currentSubject]?.[currentGrade] || [];

            if (exams.length === 0) {
                container.innerHTML = `<p class="section-title">لا توجد اختبارات شاملة لـ ${currentSubject} - ${currentGrade} حالياً.</p>`;
                showScreen('gradeComprehensiveExamScreen');
                return;
            }

            exams.forEach(exam => {
                const examCard = document.createElement('div');
                examCard.classList.add('exam-listing-card');
                if (exam.type === 'مدفوع') {
                    examCard.classList.add('disabled');
                }
                examCard.innerHTML = `
                    <div class="exam-listing-card-info">
                        <h3>${exam.name}</h3>
                        <p>عدد الأسئلة: ${exam.questions.length}</p>
                    </div>
                    <div class="exam-listing-card-actions">
                        <span class="status-badge ${exam.type === 'مجاني' ? 'free' : 'paid'}">${exam.type}</span>
                        <button class="start-button" onclick="startExam('${exam.id}', 'gradeComprehensive')">ابدأ الاختبار</button>
                    </div>
                `;
                container.appendChild(examCard);
            });
            showScreen('gradeComprehensiveExamScreen');
        }


        // شاشة اختيار الفصول (تسمى من "اختبارات حسب الفصول")
        function showChapters(subject = currentSubject, grade = currentGrade) {
            currentSubject = subject; 
            currentGrade = grade;     
            const titleElement = document.getElementById('chaptersSelectionTitle');
            titleElement.innerText = `اختر الفصل الدراسي لـ ${currentSubject} - ${currentGrade}`;

            const container = document.getElementById('chapterCardsContainer');
            container.innerHTML = ''; 

            const gradeInfo = examData[currentSubject]?.[currentGrade];
            if (!gradeInfo || Object.keys(gradeInfo).length === 0) {
                container.innerHTML = `<p class="section-title">لا توجد فصول متاحة لـ ${currentSubject} - ${currentGrade} حالياً.</p>`;
                showScreen('chaptersSelectionScreen');
                return;
            }

            for (const chapterName in gradeInfo) {
                const examsInChapter = gradeInfo[chapterName].length;
                const card = document.createElement('div');
                card.classList.add('card');
                card.onclick = () => showChapterExamsSelection(currentSubject, currentGrade, chapterName); // تغيير الوجهة هنا
                card.innerHTML = `
                    <div class="card-icon"><i class="fas fa-book"></i></div>
                    <div class="card-content">
                        <h3 class="card-title">${chapterName}</h3>
                        <p class="card-description">يحتوي هذا الفصل على ${examsInChapter} اختبار.</p>
                        <button class="card-button">عرض الاختبارات</button>
                    </div>
                `;
                container.appendChild(card);
            }
            showScreen('chaptersSelectionScreen');
        }

        // شاشة قائمة الاختبارات المتاحة للفصل - NEW SCREEN
        function showChapterExamsSelection(subject = currentSubject, grade = currentGrade, chapter = currentChapter) {
            currentSubject = subject;
            currentGrade = grade;
            currentChapter = chapter;
            const titleElement = document.getElementById('chapterExamsTitle');
            titleElement.innerText = `اختبارات ${currentChapter}`;

            const container = document.getElementById('chapterExamsContainer');
            container.innerHTML = '';

            const chapterExams = examData[currentSubject]?.[currentGrade]?.[currentChapter] || [];

            if (chapterExams.length === 0) {
                container.innerHTML = `<p class="section-title">لا توجد اختبارات متاحة في فصل ${currentChapter} حالياً.</p>`;
                showScreen('chapterExamsSelectionScreen');
                return;
            }

            chapterExams.forEach(exam => {
                const examCard = document.createElement('div');
                examCard.classList.add('exam-listing-card');
                if (exam.type === 'مدفوع') {
                    examCard.classList.add('disabled');
                }
                examCard.innerHTML = `
                    <div class="exam-listing-card-info">
                        <h3>${exam.name}</h3>
                        <p>عدد الأسئلة: ${exam.questions.length}</p>
                    </div>
                    <div class="exam-listing-card-actions">
                        <span class="status-badge ${exam.type === 'مجاني' ? 'free' : 'paid'}">${exam.type}</span>
                        <button class="start-button" onclick="startExam('${exam.id}', 'chapter')">ابدأ الاختبار</button>
                    </div>
                `;
                container.appendChild(examCard);
            });
            showScreen('chapterExamsSelectionScreen');
        }


        // دالة بدء الاختبار الفعلي (تم تعديلها لتقبل نوع الاختبار)
        function startExam(examId, examType) {
            let questionsToLoad = [];
            let exam = null;
        

            if (examType === 'comprehensive') {
                const subjectExams = comprehensiveExamsData[currentSubject];
                const exam = subjectExams ? subjectExams.find(e => e.id === examId) : null;
                questionsToLoad = exam ? exam.questions : [];
                currentChapter = null; // للتأكد من أن زر العودة يعمل بشكل صحيح
                currentGrade = null; // للتأكد من أن زر العودة يعمل بشكل صحيح
            } else if (examType === 'gradeComprehensive') {
                const gradeExams = gradeComprehensiveExamsData[currentSubject]?.[currentGrade];
                const exam = gradeExams ? gradeExams.find(e => e.id === examId) : null;
                questionsToLoad = exam ? exam.questions : [];
                currentChapter = null; // للتأكد من أن زر العودة يعمل بشكل صحيح
            } else if (examType === 'chapter') {
                const chapterExams = examData[currentSubject]?.[currentGrade]?.[currentChapter];
                const exam = chapterExams ? chapterExams.find(e => e.id === examId) : null;
                questionsToLoad = exam ? exam.questions : [];
            }
            if (exam && exam.type === 'مدفوع') { alert('.عذرا ، هذا الاختبار مدفوع. يرجى الاشتراك للوصول الية);return;}
            if (questionsToLoad.length === 0) {
                alert('لا توجد أسئلة لهذا الاختبار حالياً.');
                return;
            }

            // Shuffle questions and select a fixed number (optional, if you want to limit questions)
            // If you want ALL questions in the selected exam, remove .slice(0, QUESTIONS_PER_EXAM);
            questionsToLoad.sort(() => Math.random() - 0.5); 
            // activeQuestions = questionsToLoad.slice(0, QUESTIONS_PER_EXAM); // لو أردت تحديد عدد معين من الأسئلة لكل اختبار
            activeQuestions = questionsToLoad; // لعرض جميع الأسئلة في الاختبار المحدد

            if (activeQuestions.length === 0) {
                alert('عذراً، لم يتم العثور على أسئلة كافية لبدء الاختبار.');
                return;
            }

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
                document.getElementById('questionText').innerText = "لا توجد أسئلة متاحة.";
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

            if (activeQuestions.length === 0) {
                reviewContainer.innerHTML = '<p>لا توجد أسئلة لمراجعتها.</p>';
                document.getElementById('scorePercentage').innerText = '0%';
                document.getElementById('correctAnswersCount').innerText = '0';
                document.getElementById('incorrectAnswersCount').innerText = '0';
                document.getElementById('unansweredQuestionsCount').innerText = '0';
                return;
            }

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

        // Initialize the first screen on load
        document.addEventListener('DOMContentLoaded', () => {
            showScreen('mainScreen');
        });

