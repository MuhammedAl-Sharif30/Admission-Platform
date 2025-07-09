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
        const QUESTIONS_PER_EXAM = 10; // عدد الأسئلة التي ستظهر في كل اختبار (يمكن تعديله)

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
                // خاصية: "الامتحانات التجريبية" تكون نشطة إذا كنا في أي من شاشات الامتحانات
                if (['examsOverviewScreen', 'gradesSelectionScreen', 'chaptersSelectionScreen', 'examScreen', 'resultsScreen'].includes(screenId) && link.getAttribute('data-screen-id') === 'examsOverviewScreen') {
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
                // خاصية: "الامتحانات" تكون نشطة إذا كنا في أي من شاشات الامتحانات
                if (['examsOverviewScreen', 'gradesSelectionScreen', 'chaptersSelectionScreen', 'examScreen', 'resultsScreen'].includes(screenId) && item.getAttribute('data-screen-id') === 'examsOverviewScreen') {
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
                // خاصية: "الامتحانات التجريبية" تكون نشطة إذا كنا في أي من شاشات الامتحانات
                if (['examsOverviewScreen', 'gradesSelectionScreen', 'chaptersSelectionScreen', 'examScreen', 'resultsScreen'].includes(screenId) && link.getAttribute('data-screen-id') === 'examsOverviewScreen') {
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
            window.open(whatsappUrl, '_blank'); // استخدام _blank لفتح في تبويبة جديدة
        }

        // --- Exam Data Structure ---
        // تم إعادة هيكلة بيانات الأسئلة لتشمل المستويات والفصول
        const examData = {
            'أحياء': {
                icon: 'fas fa-dna',
                description: 'شروحات مفصلة، ملخصات، وأسئلة تدريبية في جميع فصول الأحياء.',
                grades: {
                    'المستوى الأول': {
                        'الفصل الأول: الكيمياء الحيوية': [
                            {
                                question: "توجد صبغة الكلوروفيل في خلايا بعض الكائنات مثل ...",
                                options: ["الفطريات", "البكتيريا", "النخيل", "البراميسيوم"],
                                answer: "النخيل",
                                explanation: "الكلوروفيل هي الصبغة الخضراء المسؤولة عن عملية البناء الضوئي، وتوجد بشكل أساسي في النباتات والطحالب وبعض أنواع البكتيريا. من بين الخيارات المعطاة، النخيل هو نبات ويحتوي على الكلوروفيل. الفطريات والبراميسيوم كائنات غير ذاتية التغذية لا تحتوي على الكلوروفيل. بعض أنواع البكتيريا تقوم بالبناء الضوئي لكن السؤال يركز على كائنات تحتوي الكلوروفيل بشكل عام."
                            },
                            {
                                question: "تمر الخلايا المرستيمية بــ.....",
                                options: ["جميع مراحل دورة الخلية", "بعض مراحل دورة الخلية", "طور السبات", "ليس مما سبق"],
                                answer: "جميع مراحل دورة الخلية",
                                explanation: "الخلايا المرستيمية هي خلايا نباتية غير متخصصة تتميز بقدرتها المستمرة على الانقسام. وللقيام بالانقسام، يجب أن تمر بجميع مراحل دورة الخلية (الطور البيني الذي يشمل G1, S, G2، والطور الانقسامي M)."
                            },
                            {
                                question: "تتم تفاعلات دورة كالفن في...",
                                options: ["السيتوبلازم", "البلاستيدات", "النواة", "الميتوكوندريا"],
                                answer: "البلاستيدات",
                                explanation: "دورة كالفن (التفاعلات اللاضوئية للبناء الضوئي) تتم في لحمة (Stroma) البلاستيدات الخضراء، وهي الجزء السائل داخل البلاستيدة."
                            }
                        ],
                        'الفصل الثاني: التصنيف والتنوع الحيوي': [
                            {
                                question: "في نبات الفيوناريا يتكون من القدم وشبه الساق والعنق والعلبة",
                                options: ["المشيج المذكر", "النسيج المؤنث", "النبات البوغي", "النبات المشيجي"],
                                answer: "النبات البوغي",
                                explanation: "نبات الفيوناريا (من الحزازيات) يمر بدورة حياة تتناوب فيها الأجيال. النبات البوغي (Sporophyte) هو الجيل الذي ينتج الأبواغ، ويتكون من قدم (تتصل بالنبات المشيجي)، وعنق، وعلبة (حافظة الأبواغ)."
                            },
                            {
                                question: "ظاهرة تبادل الأجيال تحدث في ...",
                                options: ["البراميسيوم", "الأميبا", "البلاناريا", "بلازموديوم الملاريا"],
                                answer: "بلازموديوم الملاريا",
                                explanation: "تبادل الأجيال (Alternation of Generations) هو ظاهرة تتضمن تعاقب جيل جنسي وجيل لاجنسي في دورة حياة الكائن الحي. بلازموديوم الملاريا (Plasmodium falciparum) يمتلك دورة حياة معقدة تتضمن مراحل جنسية ولاجنسية داخل مضيفين مختلفين (الإنسان والبعوض)، مما يمثل تبادل أجيال."
                            },
                            {
                                question: "تتكون أصابع اليدين والقدمين والأذنين ويظهر الجنين محاطاً بأربعة أغشية في....",
                                options: ["الثلاثة الأشهر الأولى", "الثلاثة الأشهر الثانية", "الثلاثة الأشهر الأخيرة", "الثلاثة الأسابيع الأخيرة"],
                                answer: "الثلاثة الأشهر الأولى",
                                explanation: "تتطور الأعضاء الرئيسية للجنين، بما في ذلك تكون أصابع اليدين والقدمين والأذنين، وتشكل الأغشية الجنينية الأربعة (الكيس الأمينوسي، الكيس المحي، المشيمة، السقاء) بشكل أساسي خلال الثلاثة أشهر الأولى من الحمل (التي تتضمن المرحلة الجنينية المبكرة)."
                            }
                        ]
                    },
                    'المستوى الثاني': {
                        'الفصل الأول: الوراثة والجينات': [
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
                            }
                        ],
                        'الفصل الثاني: فسيولوجيا النبات والحيوان': [
                            {
                                question: "ينطلق <span class='latex-math'>O<sub>2</sub></span> الناتج من البناء الضوئي إلى خارج النبات عن طريق ...",
                                options: ["الثغور", "الجذور", "الأوراق", "النتح"],
                                answer: "الثغور",
                                explanation: "الثغور (Stomata) هي فتحات صغيرة توجد بشكل رئيسي على سطح الأوراق، تسمح بتبادل الغازات (دخول <span class='latex-math'>CO<sub>2</sub></span> وخروج <span class='latex-math'>O<sub>2</sub></span> وبخار الماء) بين النبات والغلاف الجوي."
                            },
                            {
                                question: "نبات ....... يتكاثر خضرياً بواسطة نمو البراعم الجانبية في كل عين لتكوين نبات جديد.",
                                options: ["البطاطس", "الثوم", "النخيل", "النجيل"],
                                answer: "البطاطس",
                                explanation: "البطاطس هي ساق درنية (Tubers) تحتوي على 'عيون' (Eyes) وهي في الواقع براعم. يمكن زراعة قطع من درنة البطاطس تحتوي على عين أو أكثر، وتنمو هذه البراعم لتشكل نباتات جديدة متطابقة وراثياً، وهذا شكل من أشكال التكاثر الخضري."
                            }
                        ]
                    }
                }
            },
            'كيمياء': {
                icon: 'fas fa-atom',
                description: 'شروحات وافية للتفاعلات، المعادلات، والعناصر الكيميائية الهامة.',
                grades: {
                    'المستوى الأول': {
                        'الفصل الأول: أساسيات الكيمياء': [
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
                                question: "ما هو اسم العملية التي يتحول فيها الغاز مباشرة إلى مادة صلبة دون المرور بالحالة السائلة؟",
                                options: ["التسامي", "التكثف", "التبخر", "الترسيب"],
                                answer: "الترسيب",
                                explanation: "الترسيب (Deposition) هو عملية فيزيائية يتحول فيها الغاز مباشرة إلى مادة صلبة، وهي عكس التسامي. مثال على ذلك تكون الصقيع من بخار الماء مباشرة."
                            }
                        ],
                        'الفصل الثاني: الكيمياء العضوية': [
                            {
                                question: "أي من المركبات التالية يعتبر ألكاناً حلقياً؟",
                                options: ["<span class='latex-math'>C<sub>6</sub>H<sub>6</sub></span>", "<span class='latex-math'>C<sub>5</sub>H<sub>10</sub></span>", "<span class='latex-math'>C<sub>2</sub>H<sub>4</sub></span>", "<span class='latex-math'>C<sub>4</sub>H<sub>10</sub></span>"],
                                answer: "<span class='latex-math'>C<sub>5</sub>H<sub>10</sub></span>",
                                explanation: "الألكانات الحلقية (Cycloalkanes) لها الصيغة العامة <span class='latex-math'>C<sub>n</sub>H<sub>2n</sub></span>. <span class='latex-math'>C<sub>5</sub>H<sub>10</sub></span> هي صيغة البنتان الحلقي. <span class='latex-math'>C<sub>6</sub>H<sub>6</sub></span> هو البنزين (أروماتي)، <span class='latex-math'>C<sub>2</sub>H<sub>4</sub></span> هو الإيثين (ألكين)، <span class='latex-math'>C<sub>4</sub>H<sub>10</sub></span> هو البيوتان (ألكان مفتوح السلسلة)."
                            },
                            {
                                question: "كم عدد مجموعات الهيدروكسيل (<span class='latex-math'>-OH</span>) في جزيء الجلسرول (الجلسرين)؟",
                                options: ["1", "2", "3", "4"],
                                answer: "3",
                                explanation: "الجلسرول هو كحول ثلاثي الهيدروكسيل، أي أنه يحتوي على ثلاث مجموعات هيدروكسيل (<span class='latex-math'>-OH</span>) مرتبطة بثلاث ذرات كربون."
                            },
                            {
                                question: "أي من المواد التالية هي بوليمر طبيعي؟",
                                options: ["البولي إيثيلين", "النايلون", "البروتين", "البولي فينيل كلوريد"],
                                answer: "البروتين",
                                explanation: "البروتينات هي بوليمرات حيوية طبيعية تتكون من وحدات متكررة من الأحماض الأمينية. البولي إيثيلين، النايلون، والبولي فينيل كلوريد هي بوليمرات صناعية."
                            }
                        ]
                    },
                    'المستوى الثاني': {
                        'الفصل الأول: الكيمياء الفيزيائية': [
                            {
                                question: "ما هو الغاز الذي يشكل حوالي 21% من الغلاف الجوي للأرض وهو ضروري للاحتراق؟",
                                options: ["النيتروجين", "ثاني أكسيد الكربون", "الأكسجين", "الأرجون"],
                                answer: "الأكسجين",
                                explanation: "الأكسجين (O<sub>2</sub>) يشكل حوالي 21% من الغلاف الجوي وهو غاز حيوي للتنفس والاحتراق."
                            },
                            {
                                question: "في الخلية الجلفانية، تحدث عملية الأكسدة عند ...",
                                options: ["الكاثود", "الأنود", "القنطرة الملحية", "الإلكتروليت"],
                                answer: "الأنود",
                                explanation: "في الخلية الجلفانية (الخلايا الكهروكيميائية التي تنتج طاقة كهربائية)، تحدث الأكسدة (فقدان الإلكترونات) دائماً عند الأنود (القطب السالب)."
                            }
                        ],
                        'الفصل الثاني: الكيمياء التحليلية': [
                            {
                                question: "ما هو المنتج الرئيسي لتفاعل حمض مع قاعدة؟",
                                options: ["غاز", "ملح", "ماء", "ملح وماء"],
                                answer: "ملح وماء",
                                explanation: "تفاعل التعادل بين حمض وقاعدة ينتج عنه عادةً ملح وماء. على سبيل المثال، <span class='latex-math'>HCl + NaOH &rarr; NaCl + H<sub>2</sub>O</span>."
                            },
                            {
                                question: "ما هو الرقم الهيدروجيني (<span class='latex-math'>pH</span>) للمحلول المتعادل عند درجة حرارة الغرفة؟",
                                options: ["0", "7", "14", "أقل من 7"],
                                answer: "7",
                                explanation: "المحلول المتعادل (مثل الماء النقي) عند درجة حرارة 25 درجة مئوية يكون له رقم هيدروجيني (<span class='latex-math'>pH</span>) يساوي 7. المحاليل الأقل من 7 تكون حمضية، والأعلى من 7 تكون قاعدية."
                            }
                        ]
                    }
                }
            },
            'إنجليزي': {
                icon: 'fas fa-language',
                description: 'عزز مهاراتك في اللغة الإنجليزية مع نماذج متنوعة.',
                grades: {
                    'المستوى الأول': {
                        'الفصل الأول: قواعد أساسية': [
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
                                question: "Complete the sentence: 'If I <span class='english'>__</span> a bird, I would fly.'",
                                options: ["<span class='english'>was</span>", "<span class='english'>were</span>", "<span class='english'>am</span>", "<span class='english'>is</span>"],
                                answer: "<span class='english'>were</span>",
                                explanation: "This is a second conditional sentence (hypothetical situation). In such sentences, 'were' is used for all subjects in the 'if' clause, even for singular subjects like 'I', 'he', 'she', 'it'."
                            }
                        ],
                        'الفصل الثاني: مفردات وتعبيرات': [
                            {
                                question: "Which of these is a synonym for '<span class='english'>happy</span>'?",
                                options: ["<span class='english'>sad</span>", "<span class='english'>joyful</span>", "<span class='english'>angry</span>", "<span class='english'>tired</span>"],
                                answer: "<span class='english'>joyful</span>",
                                explanation: "'Joyful' means feeling, expressing, or causing great pleasure and happiness, making it a synonym for 'happy'."
                            },
                            {
                                question: "What is the plural of '<span class='english'>child</span>'?",
                                options: ["<span class='english'>childs</span>", "<span class='english'>children</span>", "<span class='english'>childes</span>", "<span class='english'>child's</span>"],
                                answer: "<span class='english'>children</span>",
                                explanation: "'Children' is the irregular plural form of 'child'. Many English nouns have irregular plural forms."
                            }
                        ]
                    }
                }
            }
        };

        // --- Exam Navigation Functions ---

        function showExamsOverview() {
            const container = document.getElementById('subjectCardsContainer');
            container.innerHTML = ''; // Clear previous content

            for (const subjectName in examData) {
                const subjectInfo = examData[subjectName];
                const card = document.createElement('div');
                card.classList.add('card');
                card.onclick = () => showGrades(subjectName);
                card.innerHTML = `
                    <div class="card-icon"><i class="${subjectInfo.icon}"></i></div>
                    <div class="card-content">
                        <h3 class="card-title">اختبارات ${subjectName}</h3>
                        <p class="card-description">${subjectInfo.description}</p>
                        <button class="card-button">اختر المستوى</button>
                    </div>
                `;
                container.appendChild(card);
            }
            showScreen('examsOverviewScreen');
        }

        function showGrades(subject = currentSubject) {
            currentSubject = subject; // Save current subject
            const container = document.getElementById('gradeCardsContainer');
            container.innerHTML = ''; // Clear previous content

            const subjectInfo = examData[currentSubject];
            if (!subjectInfo || !subjectInfo.grades || Object.keys(subjectInfo.grades).length === 0) {
                container.innerHTML = `<p>لا توجد مستويات متاحة لـ ${currentSubject} حالياً.</p>`;
                showScreen('gradesSelectionScreen');
                return;
            }

            for (const gradeName in subjectInfo.grades) {
                const card = document.createElement('div');
                card.classList.add('card');
                card.onclick = () => showChapters(currentSubject, gradeName);
                card.innerHTML = `
                    <div class="card-icon"><i class="fas fa-graduation-cap"></i></div>
                    <div class="card-content">
                        <h3 class="card-title">${gradeName}</h3>
                        <p class="card-description">استكشف الفصول والاختبارات المتاحة لهذا المستوى.</p>
                        <button class="card-button">اختر الفصل</button>
                    </div>
                `;
                container.appendChild(card);
            }
            showScreen('gradesSelectionScreen');
        }

        function showChapters(subject = currentSubject, grade = currentGrade) {
            currentSubject = subject; // Save current subject
            currentGrade = grade;     // Save current grade
            const container = document.getElementById('chapterCardsContainer');
            container.innerHTML = ''; // Clear previous content

            const gradeInfo = examData[currentSubject]?.grades[currentGrade];
            if (!gradeInfo || Object.keys(gradeInfo).length === 0) {
                container.innerHTML = `<p>لا توجد فصول متاحة لـ ${currentSubject} - ${currentGrade} حالياً.</p>`;
                showScreen('chaptersSelectionScreen');
                return;
            }

            for (const chapterName in gradeInfo) {
                const questionsInChapter = gradeInfo[chapterName].length;
                const card = document.createElement('div');
                card.classList.add('card');
                card.onclick = () => startActualExam(currentSubject, currentGrade, chapterName);
                card.innerHTML = `
                    <div class="card-icon"><i class="fas fa-book"></i></div>
                    <div class="card-content">
                        <h3 class="card-title">${chapterName}</h3>
                        <p class="card-description">يحتوي هذا الفصل على ${questionsInChapter} سؤال. ستبدأ الاختبار بـ ${QUESTIONS_PER_EXAM} أسئلة عشوائية.</p>
                        <button class="card-button">ابدأ الاختبار (${QUESTIONS_PER_EXAM} أسئلة)</button>
                    </div>
                `;
                container.appendChild(card);
            }
            showScreen('chaptersSelectionScreen');
        }

        // دالة بدء الاختبار الفعلي
        function startActualExam(subject, grade, chapter) {
            currentSubject = subject;
            currentGrade = grade;
            currentChapter = chapter;

            // الحصول على أسئلة الفصل المحدد
            let chapterQuestions = examData[currentSubject]?.grades[currentGrade]?.[currentChapter] || [];
            
            if (chapterQuestions.length === 0) {
                alert('لا توجد أسئلة لهذا الفصل حالياً.');
                showChapters(currentSubject, currentGrade); // العودة لشاشة الفصول
                return;
            }

            // خلط الأسئلة واختيار عدد محدد منها
            chapterQuestions.sort(() => Math.random() - 0.5);
            activeQuestions = chapterQuestions.slice(0, QUESTIONS_PER_EXAM);

            if (activeQuestions.length === 0) {
                alert('عذراً، لم يتم العثور على أسئلة كافية لبدء الاختبار بهذا العدد المحدد.');
                showChapters(currentSubject, currentGrade); // العودة لشاشة الفصول
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

