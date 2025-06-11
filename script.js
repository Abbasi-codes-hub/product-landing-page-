// ========== Three.js Viewer ==========
let scene, camera, renderer, product;

function init3DViewer() {
    const container = document.getElementById('product-viewer');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight, directionalLight);

    // Product Placeholder
    product = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({ color: 0x4a6bff, specular: 0x111111, shininess: 30 })
    );
    scene.add(product);

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    const animate = () => {
        requestAnimationFrame(animate);
        product.rotation.x += 0.005;
        product.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();
}

// ========== GSAP Animations ==========
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Animate elements
    const animateOnScroll = (selector, delayStep = 0.1) => {
        gsap.utils.toArray(selector).forEach((el, i) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                delay: i * delayStep,
                ease: 'power2.out'
            });
        });
    };

    animateOnScroll('[data-scroll]');
    animateOnScroll('.product-card', 0.1);
    animateOnScroll('.feature', 0.15);
}

// ========== Product Previews ==========
function initProductPreviews() {
    const previews = document.querySelectorAll('.product-preview');
    const colors = [0x4a6bff, 0xff6b6b, 0x6bff6b];

    previews.forEach((preview, index) => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, preview.clientWidth / preview.clientHeight, 0.1, 1000);
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(preview.clientWidth, preview.clientHeight);
        preview.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(ambientLight, directionalLight);

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.5, 1.5),
            new THREE.MeshPhongMaterial({ color: colors[index % colors.length], specular: 0x111111, shininess: 30 })
        );
        scene.add(cube);

        let isHovering = false;
        let targetRotation = { x: 0, y: 0 };

        preview.addEventListener('mouseenter', () => isHovering = true);
        preview.addEventListener('mouseleave', () => isHovering = false);

        preview.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            const rect = preview.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            targetRotation.y = (x - 0.5) * Math.PI;
            targetRotation.x = -(y - 0.5) * Math.PI;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += (targetRotation.x - cube.rotation.x) * 0.1;
            cube.rotation.y += (targetRotation.y - cube.rotation.y) * 0.1;
            if (!isHovering) cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    });
}

// ========== Cart Functionality ==========
function initCart() {
    let count = 0;
    const cartCount = document.querySelector('.cart-count');

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            count++;
            cartCount.textContent = count;

            // Animate Cart
            gsap.fromTo(cartCount, { scale: 1.5 }, {
                scale: 1,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });

            // Feedback Animation
            gsap.to(button, {
                backgroundColor: '#28a745',
                duration: 0.3,
                onComplete: () => {
                    gsap.to(button, {
                        backgroundColor: '#2b2d42',
                        delay: 0.5,
                        duration: 0.3
                    });
                }
            });

            button.textContent = 'Added!';
            setTimeout(() => button.textContent = 'Add to Cart', 1000);
        });
    });
}

// ========== Init All ==========
document.addEventListener('DOMContentLoaded', () => {
    init3DViewer();
    initAnimations();
    initProductPreviews();
    initCart();
});
