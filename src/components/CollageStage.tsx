import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FeaturedProject, ProjectDetail } from "../types/content";
import { ProjectFocusOverlay } from "./ProjectFocusOverlay";
import { getProjectTone } from "../utils/projectContent";

const WORLD_WIDTH = 1560;
const WORLD_HEIGHT = 1260;
const MIN_SCALE = 0.72;
const MAX_SCALE = 1.9;
const PLACEMENTS = [
  { x: 220, y: 220, width: 220, rotate: -7 },
  { x: 500, y: 180, width: 210, rotate: 5 },
  { x: 800, y: 230, width: 220, rotate: -4 },
  { x: 1095, y: 185, width: 205, rotate: 7 },
  { x: 1365, y: 255, width: 205, rotate: -5 },
  { x: 320, y: 760, width: 210, rotate: 4 },
  { x: 650, y: 680, width: 220, rotate: -6 },
  { x: 960, y: 860, width: 225, rotate: 5 },
  { x: 1215, y: 815, width: 210, rotate: -5 },
  { x: 1260, y: 1060, width: 210, rotate: 4 }
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface TransformState {
  x: number;
  y: number;
  scale: number;
}

interface CollageStageProps {
  projects: FeaturedProject[];
  activeProject?: ProjectDetail | null;
  onOpenProject: (slug: string) => void;
  onCloseProject: () => void;
}

export function CollageStage({
  projects,
  activeProject,
  onOpenProject,
  onCloseProject
}: CollageStageProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const transformRef = useRef<TransformState>({ x: 0, y: 0, scale: 1 });
  const pendingRef = useRef<TransformState>(transformRef.current);
  const dragRef = useRef({
    dragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0
  });

  const [transform, setTransform] = useState<TransformState>({ x: 0, y: 0, scale: 1 });

  const applyTransform = useCallback((next: TransformState) => {
    pendingRef.current = next;

    if (rafRef.current !== null) {
      return;
    }

    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      transformRef.current = pendingRef.current;
      setTransform(pendingRef.current);
    });
  }, []);

  const resetView = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const bounds = viewport.getBoundingClientRect();
    const fitScale = Math.min((bounds.width - 48) / WORLD_WIDTH, (bounds.height - 48) / WORLD_HEIGHT);
    const scale = clamp(bounds.width < 768 ? fitScale * 0.96 : fitScale, MIN_SCALE, 1);
    const x = (bounds.width - WORLD_WIDTH * scale) / 2;
    const y = (bounds.height - WORLD_HEIGHT * scale) / 2;
    applyTransform({ x, y, scale });
  }, [applyTransform]);

  useEffect(() => {
    resetView();
    window.addEventListener("resize", resetView);

    return () => {
      window.removeEventListener("resize", resetView);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [resetView]);

  useEffect(() => {
    if (!activeProject) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseProject();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProject, onCloseProject]);

  const visibleProjects = useMemo(() => projects.slice(0, PLACEMENTS.length), [projects]);

  const zoomAroundPoint = useCallback(
    (scaleFactor: number, pointX: number, pointY: number) => {
      const current = transformRef.current;
      const nextScale = clamp(current.scale * scaleFactor, MIN_SCALE, MAX_SCALE);
      const worldX = (pointX - current.x) / current.scale;
      const worldY = (pointY - current.y) / current.scale;

      applyTransform({
        scale: nextScale,
        x: pointX - worldX * nextScale,
        y: pointY - worldY * nextScale
      });

      return nextScale !== current.scale;
    },
    [applyTransform]
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-overlay-panel]")) {
        return;
      }

      const bounds = viewport.getBoundingClientRect();
      const pointX = event.clientX - bounds.left;
      const pointY = event.clientY - bounds.top;
      const scaleChanged = zoomAroundPoint(event.deltaY < 0 ? 1.08 : 0.92, pointX, pointY);

      if (scaleChanged) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener("wheel", handleWheel);
    };
  }, [zoomAroundPoint]);

  return (
    <section className="collage-stage">
      <div className="collage-hint">
        <span>滚轮缩放</span>
        <span>按住空白处拖动画布</span>
        <span>点击卡片进入首页内放大简介态</span>
      </div>

      <div
        ref={viewportRef}
        className={`collage-viewport${dragRef.current.dragging ? " is-dragging" : ""}`}
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("[data-card-button]") || target.closest("[data-overlay-panel]")) {
            return;
          }

          dragRef.current = {
            dragging: true,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            originX: transformRef.current.x,
            originY: transformRef.current.y
          };
          viewportRef.current?.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragRef.current.dragging || dragRef.current.pointerId !== event.pointerId) {
            return;
          }

          const dx = event.clientX - dragRef.current.startX;
          const dy = event.clientY - dragRef.current.startY;
          applyTransform({
            ...transformRef.current,
            x: dragRef.current.originX + dx,
            y: dragRef.current.originY + dy
          });
        }}
        onPointerUp={(event) => {
          if (dragRef.current.pointerId === event.pointerId) {
            dragRef.current.dragging = false;
            viewportRef.current?.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={(event) => {
          if (dragRef.current.pointerId === event.pointerId) {
            dragRef.current.dragging = false;
            viewportRef.current?.releasePointerCapture(event.pointerId);
          }
        }}
      >
        <div
          className="collage-world"
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`
          }}
        >
          {visibleProjects.map((project, index) => {
            const placement = PLACEMENTS[index];

            const tone = getProjectTone(project.slug);

            return (
              <button
                key={project.id}
                className="collage-card"
                data-card-button
                type="button"
                style={{
                  left: placement.x,
                  top: placement.y,
                  width: placement.width,
                  transform: `translate(-50%, -50%) rotate(${placement.rotate}deg)`
                }}
                onClick={() => onOpenProject(project.slug)}
              >
                <div className={`collage-card__cover collage-card__cover--${tone}`}>
                  <img src={project.cover.previewUrl} alt={project.title} />
                </div>
                <div className="collage-card__meta">
                  <strong>{project.title}</strong>
                  <span>{project.excerpt}</span>
                </div>
              </button>
            );
          })}
        </div>

        {activeProject ? <ProjectFocusOverlay project={activeProject} onClose={onCloseProject} /> : null}
      </div>
    </section>
  );
}
