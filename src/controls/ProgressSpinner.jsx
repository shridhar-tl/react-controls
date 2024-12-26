import React, { useRef, useEffect } from 'react';
import './ProgressSpinner.scss';

function ProgressSpinner({ progress, bgColor = '#6baff7', color = '#007bff', fontColor = '#0464c9', size = 180, backdrop, animate }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const shineOffsetRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) { return; }

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const lineWidth = size / 5.5;
        const radius = size / 3;

        // Function to draw the spinner with shine
        const draw = () => {
            // Clear the canvas
            ctx.clearRect(0, 0, width, height);

            // Draw background circle
            ctx.beginPath();
            ctx.strokeStyle = bgColor;
            ctx.lineWidth = lineWidth;
            ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2, false);
            ctx.stroke();

            // Calculate the end angle based on progress
            const endDegrees = (progress / 100) * 360;
            const radians = (endDegrees - 90) * (Math.PI / 180); // Subtract 90 to start from top

            // Draw progress arc
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.arc(width / 2, height / 2, radius, -0.5 * Math.PI, radians, false);
            ctx.stroke();

            if (animate) {
                // Create a gradient for the shine effect
                const shineWidth = Math.PI / 5; // Width of the shine in radians
                const currentOffset = shineOffsetRef.current;

                // Define the start and end angles for the shine
                const shineStart = currentOffset - shineWidth / 2;
                const shineEnd = currentOffset + shineWidth / 2;

                // Create a radial gradient for the shine
                const gradient = ctx.createRadialGradient(
                    width / 2 + radius * Math.cos(shineStart),
                    height / 2 + radius * Math.sin(shineStart),
                    radius * 0.9,
                    width / 2,
                    height / 2,
                    radius
                );
                gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                // Overlay the shine effect
                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = lineWidth;
                ctx.arc(width / 2, height / 2, radius, shineStart, shineEnd, false);
                ctx.stroke();
            }

            // Draw the percentage text
            const percentageText = `${Math.floor(progress)}%`;
            ctx.fillStyle = fontColor;
            const fontSize = parseInt(size / 6);
            ctx.font = `${fontSize}px Arial`;
            const textMetrics = ctx.measureText(percentageText);
            const textWidth = textMetrics.width;
            const { actualBoundingBoxAscent, actualBoundingBoxDescent } = textMetrics;
            const textHeight = actualBoundingBoxAscent + actualBoundingBoxDescent;
            ctx.fillText(percentageText, (width - textWidth) / 2, (height + textHeight) / 2);
        };

        // Animation loop to update the shine position
        const doAnimate = () => {
            // Update the shine offset
            shineOffsetRef.current += 0.02; // Adjust speed as needed
            if (shineOffsetRef.current > Math.PI * 2) {
                shineOffsetRef.current -= Math.PI * 2;
            }

            draw();
            animationRef.current = requestAnimationFrame(doAnimate);
        };

        if (animate) {
            doAnimate();
        } else {
            draw();
            return;
        }

        // Cleanup on unmount
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [progress, bgColor, color, fontColor, size, animate]);

    if (backdrop) {
        return (
            <div className="progress-loader-wrapper">
                <canvas
                    ref={canvasRef}
                    className="progress-loader"
                    width={size}
                    height={size}
                    style={{ '--size': `${size}px` }}
                />
                <div className="loader-backdrop"></div>
            </div>
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className="progress-loader"
            width={size}
            height={size}
        />
    );
}

export default ProgressSpinner;