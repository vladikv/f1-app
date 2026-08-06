import {
    AfterViewInit, Component, ElementRef, OnDestroy, ViewChild
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'app-tyre-scene',
    standalone: true,
    template: `<canvas #canvas class="tyre-canvas"></canvas>`,
    styles: [`
    .tyre-canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class TyreSceneComponent implements AfterViewInit, OnDestroy {
    @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

    private renderer!: THREE.WebGLRenderer;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private tyreGroup!: THREE.Group;
    private animationFrameId = 0;
    private resizeObserver?: ResizeObserver;

    ngAfterViewInit(): void {
        // Respect reduced-motion: render one static frame and stop.
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.initScene();
        this.buildTyre();

        if (prefersReducedMotion) {
            this.renderer.render(this.scene, this.camera);
        } else {
            this.animate();
        }

        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.canvasRef.nativeElement);
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this.animationFrameId);
        this.resizeObserver?.disconnect();
        this.renderer?.dispose();
    }

    private initScene(): void {
        const canvas = this.canvasRef.nativeElement;
        const { clientWidth: width, clientHeight: height } = canvas;

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        this.camera.position.set(0, 0, 8);

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(width, height, false);

        // Two-point lighting: a cool rim light (purple, matches --purple-sector)
        // and a warm key light (amber, matches --amber-warn) — ties the 3D
        // object's lighting back to the app's own color tokens.
        const rimLight = new THREE.PointLight(0x7c3fe0, 8, 20);
        rimLight.position.set(-4, 2, 4);
        this.scene.add(rimLight);

        const keyLight = new THREE.PointLight(0xffb020, 4, 20);
        keyLight.position.set(4, -2, 3);
        this.scene.add(keyLight);

        this.scene.add(new THREE.AmbientLight(0x404050, 1.5));
    }

    private buildTyre(): void {
        this.tyreGroup = new THREE.Group();

        // Tread: a torus with low radial segments — reads as faceted/
        // technical rather than smooth-and-generic.
        const treadGeometry = new THREE.TorusGeometry(2, 0.6, 12, 32);
        const treadMaterial = new THREE.MeshStandardMaterial({
            color: 0x1c2330,
            roughness: 0.7,
            metalness: 0.2
        });
        const tread = new THREE.Mesh(treadGeometry, treadMaterial);
        this.tyreGroup.add(tread);

        // Rim: a narrower cylinder inside the torus, in the purple accent —
        // suggests an alloy wheel without modeling one in detail.
        const rimGeometry = new THREE.CylinderGeometry(1.3, 1.3, 0.4, 16);
        const rimMaterial = new THREE.MeshStandardMaterial({
            color: 0x7c3fe0,
            roughness: 0.3,
            metalness: 0.6,
            emissive: 0x2a1550,
            emissiveIntensity: 0.4
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.x = Math.PI / 2;
        this.tyreGroup.add(rim);

        // Spokes: thin boxes radiating from the rim — small detail that
        // sells the "wheel" reading at low poly count.
        for (let i = 0; i < 5; i++) {
            const spoke = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 1.1, 0.15),
                rimMaterial
            );
            spoke.rotation.z = (i / 5) * Math.PI * 2;
            spoke.rotation.x = Math.PI / 2;
            this.tyreGroup.add(spoke);
        }

        this.tyreGroup.rotation.x = 0.4;
        this.scene.add(this.tyreGroup);
    }

    private animate = (): void => {
        this.animationFrameId = requestAnimationFrame(this.animate);
        // Slow, ambient rotation — deliberately unhurried so it reads as
        // atmosphere behind the hero text, not a distraction competing with it.
        this.tyreGroup.rotation.y += 0.003;
        this.renderer.render(this.scene, this.camera);
    };

    private handleResize(): void {
        const canvas = this.canvasRef.nativeElement;
        const { clientWidth: width, clientHeight: height } = canvas;
        if (width === 0 || height === 0) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    }
}