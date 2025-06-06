"use client";
import StackIcon from "tech-stack-icons";
import styles from "./page.module.css";
import React, { useRef, useEffect, useState, useCallback } from "react";

const ICONS = [
  "reactjs", "github", "vercel","python", "nextjs2", "typescript", "html5", "css3", "nodejs", "tailwindcss", "sass", "nuxtjs", "astro", "wordpress", "graphql", "docker", "figma", "ai", "cloudflare", "nestjs", "sveltejs", "aws", "ec2", "swift", "shopify", "woocommerce", "wix"
];

function getSpherePosition(index: number, total: number, radius: number) {
  // Golden Section Spiral for even distribution on a sphere
  const phi = Math.acos(-1 + (2 * index + 1) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * index;
  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);
  return { x, y, z };
}

export default function Home() {
  const [radius, setRadius] = useState(300);
  const [iconSize, setIconSize] = useState(80);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setRadius(150);
        setIconSize(40);
      } else if (width <= 768) {
        setRadius(200);
        setIconSize(60);
      } else {
        setRadius(300);
        setIconSize(80);
      }
    };

    // Initial call
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Spacebar toggle handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      setPaused((p) => !p);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Mouse event handlers for spinning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    setPaused(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setSpinSpeed({
      x: deltaX * 0.1,
      y: deltaY * 0.1
    });
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setPaused(false);
  };

  // Modified animation effect
  useEffect(() => {
    let last = Date.now();
    const animate = () => {
      const now = Date.now();
      const delta = (now - last) / 1000;
      last = now;

      if (!paused) {
        // Apply spin speed with decay
        setRotation((rot) => ({
          x: rot.x + (spinSpeed.x + 0.15) * delta,
          y: rot.y + (spinSpeed.y + 0.25) * delta,
        }));

        // Decay spin speed
        setSpinSpeed((speed) => ({
          x: speed.x * 0.95,
          y: speed.y * 0.95,
        }));
      }

      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [paused]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}></h1>
        <div
          className={styles.iconCloud3D}
          style={{
            perspective: "900px",
          }}
        >
          <div
            className={styles.iconCloudInner}
            style={{
              transform: `rotateX(${rotation.x * 40}deg) rotateY(${rotation.y * 60}deg)`,
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {ICONS.map((name, i) => {
              const { x, y, z } = getSpherePosition(i, ICONS.length, radius);
              const isGithub = name === "github";
              return (
                <div
                  key={name}
                  className={styles.iconWrapper}
                  style={{
                    transform: `
                      translate3d(${x}px, ${y}px, ${z}px)
                      rotateY(${-rotation.y * 60}deg)
                      rotateX(${-rotation.x * 40}deg)
                    `
                  }}
                >
                  {name === "github" ? (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 256 249" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"><g fill="#161614"><path d="M127.505 0C57.095 0 0 57.085 0 127.505c0 56.336 36.534 104.13 87.196 120.99 6.372 1.18 8.712-2.766 8.712-6.134 0-3.04-.119-13.085-.173-23.739-35.473 7.713-42.958-15.044-42.958-15.044-5.8-14.738-14.157-18.656-14.157-18.656-11.568-7.914.872-7.752.872-7.752 12.804.9 19.546 13.14 19.546 13.14 11.372 19.493 29.828 13.857 37.104 10.6 1.144-8.242 4.449-13.866 8.095-17.05-28.32-3.225-58.092-14.158-58.092-63.014 0-13.92 4.981-25.295 13.138-34.224-1.324-3.212-5.688-16.18 1.235-33.743 0 0 10.707-3.427 35.073 13.07 10.17-2.826 21.078-4.242 31.914-4.29 10.836.048 21.752 1.464 31.942 4.29 24.337-16.497 35.029-13.07 35.029-13.07 6.94 17.563 2.574 30.531 1.25 33.743 8.175 8.929 13.122 20.303 13.122 34.224 0 48.972-29.828 59.756-58.22 62.912 4.573 3.957 8.648 11.717 8.648 23.612 0 17.06-.148 30.791-.148 34.991 0 3.393 2.295 7.369 8.759 6.117 50.634-16.879 87.122-64.656 87.122-120.973C255.009 57.085 197.922 0 127.505 0" fill="white"/><path d="M47.755 181.634c-.28.633-1.278.823-2.185.389-.925-.416-1.445-1.28-1.145-1.916.275-.652 1.273-.834 2.196-.396.927.415 1.455 1.287 1.134 1.923M54.027 187.23c-.608.564-1.797.302-2.604-.589-.834-.889-.99-2.077-.373-2.65.627-.563 1.78-.3 2.616.59.834.899.996 2.08.36 2.65M58.33 194.39c-.782.543-2.06.034-2.849-1.1-.781-1.133-.781-2.493.017-3.038.792-.545 2.05-.055 2.85 1.07.78 1.153.78 2.513-.019 3.069M65.606 202.683c-.699.77-2.187.564-3.277-.488-1.114-1.028-1.425-2.487-.724-3.258.707-.772 2.204-.555 3.302.488 1.107 1.026 1.445 2.496.7 3.258M75.01 205.483c-.307.998-1.741 1.452-3.185 1.028-1.442-.437-2.386-1.607-2.095-2.616.3-1.005 1.74-1.478 3.195-1.024 1.44.435 2.386 1.596 2.086 2.612M85.714 206.67c.036 1.052-1.189 1.924-2.705 1.943-1.525.033-2.758-.818-2.774-1.852 0-1.062 1.197-1.926 2.721-1.951 1.516-.03 2.758.815 2.758 1.86M96.228 206.267c.182 1.026-.872 2.08-2.377 2.36-1.48.27-2.85-.363-3.039-1.38-.184-1.052.89-2.105 2.367-2.378 1.508-.262 2.857.355 3.049 1.398"/></g></svg>
                  ) : name === "shopify" ? (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 256 292" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className={styles.icon} data-name="shopify"><path d="M223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-1.703-1.703-5.029-1.185-6.32-.805-.19.056-3.388 1.043-8.678 2.68-5.18-14.906-14.322-28.604-30.405-28.604-.444 0-.901.018-1.358.044C129.31 3.407 123.644.779 118.75.779c-37.465 0-55.364 46.835-60.976 70.635-14.558 4.511-24.9 7.718-26.221 8.133-8.126 2.549-8.383 2.805-9.45 10.462C21.3 95.806.038 260.235.038 260.235l165.678 31.042 89.77-19.42S223.973 58.8 223.775 57.34zM156.49 40.848l-14.019 4.339c.005-.988.01-1.96.01-3.023 0-9.264-1.286-16.723-3.349-22.636 8.287 1.04 13.806 10.469 17.358 21.32zm-27.638-19.483c2.304 5.773 3.802 14.058 3.802 25.238 0 .572-.005 1.095-.01 1.624-9.117 2.824-19.024 5.89-28.953 8.966 5.575-21.516 16.025-31.908 25.161-35.828zm-11.131-10.537c1.617 0 3.246.549 4.805 1.622-12.007 5.65-24.877 19.88-30.312 48.297l-22.886 7.088C75.694 46.16 90.81 10.828 117.72 10.828z" fill="#95BF46"/><path d="M221.237 54.983c-1.055-.088-23.383-1.743-23.383-1.743s-15.507-15.395-17.209-17.099c-.637-.634-1.496-.959-2.394-1.099l-12.527 256.233 89.762-19.418S223.972 58.8 223.774 57.34c-.201-1.46-1.48-2.268-2.537-2.357-1.055-.088-23.383-1.743-23.383-1.743" fill="#5E8E3E"/><path d="M135.242 104.585l-11.069 32.926s-9.698-5.176-21.586-5.176c-17.428 0-18.305 10.937-18.305 13.693 0 15.038 39.2 20.8 39.2 56.024 0 27.713-17.577 45.558-41.277 45.558-28.44 0-42.984-17.7-42.984-17.7l7.615-25.16s14.95 12.835 27.565 12.835c8.243 0 11.596-6.49 11.596-11.232 0-19.616-32.16-20.491-32.16-52.724 0-27.129 19.472-53.382 58.778-53.382 15.145 0 22.627 4.338 22.627 4.338" fill="#FFF"/></svg>
                  ) : name === "woocommerce" ? (
                    <svg width={iconSize} height={iconSize} viewBox="0 0 256 153" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" className={styles.icon} data-name="woocommerce"><path d="M23.759 0h208.378C245.325 0 256 10.675 256 23.863v79.541c0 13.188-10.675 23.863-23.863 23.863H157.41l10.257 25.118-45.109-25.118H23.863c-13.187 0-23.862-10.675-23.862-23.863V23.863C-.104 10.78 10.57 0 23.759 0z" fill="#9B5C8F"/><path d="M14.578 21.75c1.457-1.978 3.642-3.018 6.556-3.226 5.308-.417 8.326 2.08 9.054 7.492 3.226 21.75 6.764 40.17 10.51 55.259l22.79-43.395c2.082-3.955 4.684-6.036 7.806-6.244 4.579-.312 7.388 2.601 8.533 8.741 2.602 13.84 5.932 25.6 9.886 35.59 2.706-26.432 7.285-45.476 13.737-57.235 1.56-2.914 3.85-4.371 6.868-4.58 2.394-.207 4.579.521 6.556 2.082 1.977 1.561 3.018 3.538 3.226 5.932.104 1.873-.208 3.434-1.04 4.995-4.059 7.493-7.39 20.085-10.095 37.567-2.601 16.963-3.538 30.18-2.914 39.65.209 2.6-.208 4.89-1.248 6.868-1.25 2.289-3.122 3.538-5.516 3.746-2.706.208-5.515-1.04-8.221-3.85-9.678-9.887-17.379-24.664-22.998-44.332-6.765 13.32-11.76 23.31-14.986 29.97-6.14 11.76-11.343 17.796-15.714 18.108-2.81.208-5.203-2.186-7.284-7.18-5.307-13.633-11.031-39.962-17.17-78.986-.417-2.706.207-5.1 1.664-6.972zm223.636 16.338c-3.746-6.556-9.262-10.51-16.65-12.072-1.978-.416-3.85-.624-5.62-.624-9.99 0-18.107 5.203-24.455 15.61-5.412 8.845-8.117 18.627-8.117 29.346 0 8.013 1.665 14.881 4.995 20.605 3.746 6.556 9.262 10.51 16.65 12.071 1.977.417 3.85.625 5.62.625 10.094 0 18.211-5.203 24.455-15.61 5.411-8.95 8.117-18.732 8.117-29.45.104-8.117-1.665-14.882-4.995-20.501zm-13.112 28.826c-1.457 6.868-4.059 11.967-7.91 15.401-3.017 2.706-5.827 3.85-8.428 3.33-2.498-.52-4.58-2.705-6.14-6.764-1.25-3.226-1.873-6.452-1.873-9.47 0-2.601.208-5.203.728-7.596.937-4.267 2.706-8.43 5.516-12.384 3.434-5.1 7.076-7.18 10.822-6.452 2.498.52 4.58 2.706 6.14 6.764 1.25 3.226 1.873 6.452 1.873 9.47.105 2.706-.208 5.307-.728 7.7zm-52.033-28.826c-3.746-6.556-9.366-10.51-16.65-12.072-1.977-.416-3.85-.624-5.62-.624-9.99 0-18.107 5.203-24.455 15.61-5.411 8.845-8.117 18.627-8.117 29.346 0 8.013 1.665 14.881 4.995 20.605 3.746 6.556 9.262 10.51 16.65 12.071 1.978.417 3.85.625 5.62.625 10.094 0 18.211-5.203 24.455-15.61 5.412-8.95 8.117-18.732 8.117-29.45 0-8.117-1.665-14.882-4.995-20.501zm-13.216 28.826c-1.457 6.868-4.059 11.967-7.909 15.401-3.018 2.706-5.828 3.85-8.43 3.33-2.497-.52-4.578-2.705-6.14-6.764-1.248-3.226-1.872-6.452-1.872-9.47 0-2.601.208-5.203.728-7.596.937-4.267 2.706-8.43 5.516-12.384 3.434-5.1 7.076-7.18 10.822-6.452 2.498.52 4.58 2.706 6.14 6.764 1.25 3.226 1.873 6.452 1.873 9.47.105 2.706-.208 5.307-.728 7.7z" fill="#FFF"/></svg>
                  ): name === "vercel" ? (
                    <svg fill="white" fill-rule="evenodd" height={iconSize} style={{ flex: 'none', lineHeight: '1' }} viewBox="0 0 24 24" width={iconSize} xmlns="http://www.w3.org/2000/svg"><title>Vercel</title><path d="M12 0l12 20.785H0L12 0z"></path></svg>
                  ): name === "wix" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 -0.558 77.894 30.921" className={styles.icon} data-name="wix"><path d="M43.95.521C42.53 1.266 42 2.524 42 6c0 0 .72-.696 1.786-1.084a7.545 7.545 0 0 0 1.827-.992C46.814 3.044 47 1.91 47 0c0 0-1.958-.053-3.05.52M33.357 4.294l-4.114 16.02-3.423-13.11c-.333-1.394-.934-3.117-1.885-4.283-1.211-1.485-3.673-1.578-3.934-1.578-.263 0-2.725.093-3.935 1.578-.951 1.166-1.552 2.89-1.886 4.283l-3.422 13.112L6.644 4.294S6.28 2.539 5.038 1.438C3.022-.347 0 .034 0 .034l7.88 29.941s2.6.19 3.9-.478c1.708-.875 2.521-1.55 3.556-5.624.922-3.632 3.499-14.3 3.739-15.06.12-.375.27-1.272.926-1.272.67 0 .808.897.924 1.272.237.761 2.817 11.428 3.74 15.06 1.034 4.074 1.848 4.749 3.556 5.624 1.3.667 3.9.478 3.9.478L40 .035s-3.021-.382-5.037 1.403c-1.243 1.1-1.606 2.856-1.606 2.856zM46.997 5s-.46.763-1.507 1.392c-.674.405-1.32.678-2.013 1.035C42.315 8.025 42 8.692 42 9.709v20.244s1.854.251 3.067-.412c1.56-.854 1.919-1.678 1.933-5.387V6.08h-.003V5zm20.687 10.007L77.894.16s-4.308-.717-6.442 1.182c-1.365 1.215-2.893 3.4-2.893 3.4l-3.756 5.295c-.182.275-.422.575-.802.575-.38 0-.62-.3-.801-.575l-3.758-5.295s-1.526-2.185-2.892-3.4C54.417-.558 50.107.16 50.107.16l10.21 14.847-10.184 14.8s4.489.555 6.623-1.344c1.365-1.216 2.686-3.19 2.686-3.19l3.758-5.295c.18-.275.42-.575.801-.575.38 0 .62.3.802.575l3.756 5.294s1.4 1.975 2.765 3.191c2.134 1.9 6.543 1.345 6.543 1.345l-10.183-14.8z" fill="white"/></svg>
                  ): name === "reactjs" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "python" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "nextjs2" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "typescript" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "html5" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "css3" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "nodejs" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "tailwindcss" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "sass" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "nuxtjs" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "astro" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "wordpress" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "graphql" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "docker" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "figma" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "ai" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "cloudflare" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "nestjs" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "sveltejs" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "aws" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "ec2" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ): name === "swift" ? (
                    <StackIcon name={name} className={styles.icon} style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
                  ) : (
                    <StackIcon name={name} className={styles.icon} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
