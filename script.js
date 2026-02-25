/**
 * ===== وظائف تقرير الإنجازات - جمعية عناية =====
 * يحتوي هذا الملف على كافة المنطق البرمجي الخاص بالتحريكات،
 * عدادات الأرقام، مراقبة التمرير، وتأثيرات التفاعل.
 */

// 1. وظيفة تحريك العداد الرقمي (بالأرقام الإنجليزية كما في التصميم)
// تستقبل: العنصر المراد تحديثه، الرقم النهائي، ومدة التحريك
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // استخدام معادلة Ease Out Cubic لجعل الحركة تبدأ سريعة ثم تبطئ تدريجياً
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);

        // عرض الرقم بصيغة فاصلة الآلاف (مثلاً 76,800)
        element.textContent = current.toLocaleString('en-US');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// 2. وظيفة مراقبة ظهور العناصر أثناء التمرير (Intersection Observer)
function createObserver(selector, callback, options = {}) {
    const defaultOptions = {
        threshold: 0.05, // تقليل العتبة لضمان التفعيل في الجوال
        rootMargin: '0px 0px -10px 0px',
        ...options
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target); // إيقاف المراقبة بعد أول ظهور لتوفير الأداء
            }
        });
    }, defaultOptions);

    document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

// 3. تهيئة بطاقات المؤشرات الرئيسية (KPIs)
function initKPICards() {
    createObserver('.kpi-card', (card) => {
        // إضافة تأخير متتابع (Staggered Delay) لكل بطاقة
        const delay = Array.from(card.parentElement.children).indexOf(card) * 150;
        setTimeout(() => {
            card.classList.add('visible'); // تفعيل فئة الظهور التدريجي

            // تشغيل عداد الأرقام إذا كان البطاقة تحتوي على قيمة
            const valueEl = card.querySelector('.kpi-value');
            if (valueEl && valueEl.dataset.count !== undefined) {
                animateCounter(valueEl, parseInt(valueEl.dataset.count), 2000);
            }
        }, delay);
    });
}

// 4. تهيئة رسم بياني متطور للمشاريع (ApexCharts)
function initChartBars() {
    createObserver('#projectsRevenueChart', (container) => {
        renderProjectsChart();
    });
}

function renderProjectsChart() {
    const categories = [
        'جامع محمد الصقعبي',
        'صيانة بيوت الله',
        'سقيا الماء',
        'المصلى المتنقل',
        'مسجد الهدى والسلام'
    ];

    const values = [34500, 23821, 10600, 4506, 2741];

    const options = {
        series: [{
            name: 'إجمالي التبرعات',
            data: values
        }],
        chart: {
            type: 'bar',
            height: 400,
            fontFamily: 'Tajawal, sans-serif',
            toolbar: { show: false },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 1200
            },
            foreColor: '#9ca3af'
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                horizontal: true,
                barHeight: '65%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        colors: ['#f59e0b', '#10b981', '#10b981', '#10b981', '#10b981'],
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val.toLocaleString() + ' ر.س';
            },
            style: {
                fontSize: '12px',
                fontWeight: 900,
                colors: ["#fff"]
            }
        },
        xaxis: {
            categories: categories,
            labels: {
                formatter: (val) => val.toLocaleString()
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '14px',
                    fontWeight: 700
                },
                align: 'left' // محاذاة الأسماء لليسار بما أن الاتجاه LTR
            }
        },
        grid: {
            borderColor: '#374151',
            strokeDashArray: 4,
            padding: {
                left: 10,
                right: 20
            }
        },
        tooltip: {
            theme: 'dark'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    height: 350
                },
                plotOptions: {
                    bar: {
                        barHeight: '55%'
                    }
                },
                xaxis: {
                    labels: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '10px'
                        },
                        maxWidth: 80
                    }
                },
                dataLabels: {
                    style: {
                        fontSize: '9px'
                    }
                }
            }
        }]
    };

    const container = document.querySelector("#projectsRevenueChart");
    if (container) {
        container.innerHTML = "";
        const chart = new ApexCharts(container, options);
        chart.render();
    }
}

// 5. تهيئة بطاقات الإنجازات/الأثر (Impact Cards)
function initImpactCards() {
    createObserver('.impact-card', (card) => {
        const delay = Array.from(card.parentElement.children).indexOf(card) * 150;
        setTimeout(() => {
            card.classList.add('visible');
        }, delay);
    });
}

// 6. تهيئة بطاقات الربط الاستراتيجي (Strategic Cards)
function initStrategicCards() {
    createObserver('.strategic-card', (card) => {
        const delay = Array.from(card.parentElement.children).indexOf(card) * 150;
        setTimeout(() => {
            card.classList.add('visible');
        }, delay);
    });
}

// 7. تحريك عدادات قسم الهيرو (Hero Counters)
function initHeroCounters() {
    const heroValues = document.querySelectorAll('.hero-stat-value');
    heroValues.forEach(el => {
        if (el.dataset.count !== undefined) {
            setTimeout(() => {
                animateCounter(el, parseInt(el.dataset.count), 2500);
            }, 500);
        }
    });
}

// 8. نظام الجزيئات المتحركة في الخلفية (Background Particles)
function initParticles() {
    const container = document.getElementById('bgParticles');
    if (!container) return;

    const particleCount = 35; // عدد النقاط المضيئة في الخلفية

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // تحديد حجم ومكان وسرعة عشوائية لكل ذرة لتظهر بشكل طبيعي
        const size = Math.random() * 5 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 18 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 8) + 's';

        container.appendChild(particle);
    }
}

// 9. تحريك خط الرحلة الزمني (Journey Timeline)
function initJourneyTimeline() {
    const steps = document.querySelectorAll('.journey-step');
    const line = document.querySelector('.journey-line');

    // تحريك الخط الطولي عند وصول المستخدم له
    if (line) {
        createObserver('.journey-timeline', () => {
            setTimeout(() => {
                line.classList.add('animated');
            }, 300);
        });
    }

    // تهيئة تأخير مخصص لكل مرحلة في الرحلة
    steps.forEach((step, i) => {
        step.style.transitionDelay = `${i * 0.2}s`;
    });

    createObserver('.journey-step', (step) => {
        step.classList.add('visible');
    });
}

// 10. تأثير بارالاكس خفيف في قسم الهيرو (Parallax Effect)
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroContent = hero.querySelector('.hero-content');
        // تحريك المحتوى للأعلى ببطء أثناء التمرير لإعطاء شعور بالعمق
        if (heroContent && scrollY < 600) {
            heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
            heroContent.style.opacity = 1 - (scrollY / 700);
        }
    }, { passive: true });
}

// 11. الكشف التدريجي عن رؤوس الأقسام (Section Headers Reveal)
function initSectionHeaders() {
    document.querySelectorAll('.section-header').forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        header.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    createObserver('.section-header', (header) => {
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    });
}

// 12. تأثير الميلان ثلاثي الأبعاد عند مرور الفأرة (3D Tilt Effect)
function initCardTilt() {
    document.querySelectorAll('.kpi-card, .impact-card, .strategic-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // حساب زوايا الدوران بناءً على موقع الفأرة بالنسبة للمنتصف
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        // إعادة البطاقة لوضعها الطبيعي عند خروج الفأرة
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}

// 13. زر العودة للأعلى (Scroll to Top)
function initScrollTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);

    // إظهار الزر فقط بعد النزول لمسافة 400 بكسل
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}



// تفعيل كافة الوظائف عند اكتمال تحميل هيكل الصفحة والموارد
document.addEventListener('DOMContentLoaded', () => {
    initParticles();       // خلفية الجزيئات المضيئة
    initHeroCounters();    // عدادات الهيرو
    initKPICards();        // مؤشرات الأداء
    initChartBars();       // الرسوم البيانية
    initImpactCards();     // بطاقات الإنجاز
    initStrategicCards();  // بطاقات الربط الاستراتيجي
    initJourneyTimeline(); // خط الرحلة
    initParallax();        // تأثير العمق
    initSectionHeaders();  // رؤوس الأقسام
    initCardTilt();        // تفاعل البطاقات
    initScrollTop();       // زر العودة للأعلى
});
