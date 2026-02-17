import React, { useEffect, useMemo, useRef, useState } from "react";

interface AutoScrollCardsProps {
  children: React.ReactNode;
  isMobile: boolean;
  direction: "left" | "right";
  pauseMs?: number;
  animMs?: number;
  mobileOnly?: boolean;
  paused?: boolean;
  webMode?: "step" | "continuous";
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateScrollLeft(
  el: HTMLElement,
  to: number,
  duration: number,
  cancelRef: { cancelled: boolean }
) {
  const from = el.scrollLeft;
  const diff = to - from;

  if (Math.abs(diff) < 0.5 || duration <= 0) {
    el.scrollLeft = to;
    return;
  }

  let start: number | null = null;

  const tick = (ts: number) => {
    if (cancelRef.cancelled) return;
    if (start === null) start = ts;

    const p = Math.min(1, (ts - start) / duration);
    const eased = easeInOutCubic(p);

    el.scrollLeft = from + diff * eased;

    if (p < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export default function AutoScrollCardsRecipe({
  children,
  isMobile,
  direction,
  pauseMs = 2000,
  animMs = 450,
  mobileOnly = true,
  paused = false,
  webMode = "step",
}: AutoScrollCardsProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // index within ONE set (0..n-1)
  const idxRef = useRef(0);
  // which duplicated set we're in (cycle)
  const cycleRef = useRef(0);

  const setWidthRef = useRef<number>(0);
  const setStartRef = useRef<number>(0); // padding-left base
  const positionsRef = useRef<number[]>([]);

  // ✅ drag state
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  // smooth drag via RAF
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const pendingXRef = useRef<number | null>(null);
  const dragRafRef = useRef<number | null>(null);

  // ✅ restart effects cleanly after drag
  const [kick, setKick] = useState(0);

  // ✅ prevents alignStart() from resetting after drag kick
  const initializedRef = useRef(false);

  // ✅ ONE cancel ref for ANY in-flight animation (auto + snap)
  const activeAnimCancelRef = useRef<{ cancelled: boolean } | null>(null);
  const cancelActiveAnim = () => {
    if (activeAnimCancelRef.current) {
      activeAnimCancelRef.current.cancelled = true;
      activeAnimCancelRef.current = null;
    }
  };

  const childArray = useMemo(() => React.Children.toArray(children), [children]);
  const shouldRun = mobileOnly ? isMobile : true;

  const repeatCount = useMemo(() => {
    const n = childArray.length;
    if (!shouldRun) return 1;

    const isWeb = !isMobile;
    if (n <= 3) return 6;
    if (n <= 6) return isWeb ? 6 : 4;
    return isWeb ? 4 : 2;
  }, [childArray.length, shouldRun, isMobile]);

  const items = useMemo(() => {
    if (!shouldRun) return childArray;
    const out: React.ReactNode[] = [];
    for (let i = 0; i < repeatCount; i++) out.push(...childArray);
    return out;
  }, [childArray, shouldRun, repeatCount]);

  const stopStep = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const stopContinuous = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const stopResumeTimer = () => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = null;
  };

  const waitForLayout = (cb: () => void) => {
    requestAnimationFrame(() => requestAnimationFrame(cb));
  };

  const getEls = () => {
    const viewport = viewportRef.current;
    if (!viewport) return null;
    const scrollRow = viewport.querySelector<HTMLDivElement>(".recipe-scroll");
    if (!scrollRow) return null;
    return { viewport, scrollRow };
  };

  /**
   * ✅ recompute using offsetLeft (stable with peek padding)
   * (NO CHANGES HERE)
   */
  const recompute = () => {
    const res = getEls();
    if (!res) return false;

    const { viewport, scrollRow } = res;
    const childrenEls = Array.from(scrollRow.children) as HTMLElement[];
    if (!childrenEls.length) return false;

    const n = childArray.length;
    if (n < 1) return false;

    const firstSet = childrenEls.slice(0, n);
    if (firstSet.length !== n) return false;

    const viewportW = viewport.clientWidth;

    const rowStyle = window.getComputedStyle(scrollRow);
    const padLeft = parseFloat(rowStyle.paddingLeft || "0") || 0;
    setStartRef.current = padLeft;

    const first = firstSet[0];
    const last = firstSet[n - 1];

    const setWidth = last.offsetLeft + last.offsetWidth - first.offsetLeft;
    if (!setWidth || setWidth < 1) return false;
    setWidthRef.current = setWidth;

    const PEEK_BIAS = Math.min(80, Math.max(20, viewportW * 0.05));

    const positions = firstSet.map((el) => {
      const center = el.offsetLeft + el.offsetWidth / 2;
      return center - viewportW / 2 + PEEK_BIAS;
    });

    positionsRef.current = positions;
    return true;
  };

  // keep metrics updated
  useEffect(() => {
    if (paused || !shouldRun) return;

    const res = getEls();
    if (!res) return;

    const { scrollRow } = res;

    waitForLayout(() => {
      recompute();
    });

    const ro = new ResizeObserver(() => {
      recompute();
    });
    ro.observe(scrollRow);

    return () => ro.disconnect();
  }, [paused, shouldRun, items.length, childArray.length]);

  /* =========================
     helpers
     ========================= */

  const keepCycleInRunway = (viewport: HTMLDivElement) => {
    const setWidth = setWidthRef.current;
    if (!setWidth) return;

    const safeMin = 1;
    const safeMax = Math.max(2, repeatCount - 2);
    const span = safeMax - safeMin;
    if (span <= 0) return;

    while (cycleRef.current > safeMax) {
      cycleRef.current -= span;
      viewport.scrollLeft -= setWidth * span;
    }

    while (cycleRef.current < safeMin) {
      cycleRef.current += span;
      viewport.scrollLeft += setWidth * span;
    }
  };

  const keepScrollInMiddleBand = (viewport: HTMLDivElement) => {
    const setWidth = setWidthRef.current;
    if (!setWidth) return;

    const safeMin = 1;
    const safeMax = Math.max(2, repeatCount - 2);

    if (cycleRef.current <= safeMin) {
      const bump = Math.max(1, Math.floor((safeMax - safeMin) / 2));
      cycleRef.current += bump;
      viewport.scrollLeft += setWidth * bump;
    } else if (cycleRef.current >= safeMax) {
      const bump = Math.max(1, Math.floor((safeMax - safeMin) / 2));
      cycleRef.current -= bump;
      viewport.scrollLeft -= setWidth * bump;
    }

    keepCycleInRunway(viewport);
  };

  /**
   * ✅ Smooth drag wrap using REAL scroll edges.
   * Teleports ONLY when near the true ends (rare), and keeps finger smooth by shifting drag origin.
   */
  const wrapRunwayDuringDrag = (viewport: HTMLDivElement) => {
    const setWidth = setWidthRef.current;
    if (!setWidth) return;
    if (repeatCount < 3) return;

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    if (maxScroll <= 0) return;

    // Only if you get close to edges (half a set)
    const edgeBuffer = setWidth * 0.5;

    // Teleport by a big chunk so you don't hit edge repeatedly
    const spanSets = Math.max(1, repeatCount - 2);
    const jump = setWidth * spanSets;

    if (viewport.scrollLeft < edgeBuffer) {
      viewport.scrollLeft += jump;
      dragStartScrollLeftRef.current += jump;
    } else if (viewport.scrollLeft > maxScroll - edgeBuffer) {
      viewport.scrollLeft -= jump;
      dragStartScrollLeftRef.current -= jump;
    }
  };

  const commitToNearest = (viewport: HTMLDivElement, animate: boolean) => {
    const ok = recompute();
    if (!ok) return;

    const setWidth = setWidthRef.current;
    const positions = positionsRef.current;
    if (!setWidth || !positions.length) return;

    const x = viewport.scrollLeft;
    const cycle = Math.floor(x / setWidth);
    const within = ((x % setWidth) + setWidth) % setWidth;

    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < positions.length; i++) {
      const d = Math.abs(within - positions[i]);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    idxRef.current = bestIdx;
    cycleRef.current = cycle;

    keepScrollInMiddleBand(viewport);

    const target = positions[bestIdx] + cycleRef.current * setWidth;

    if (animate) {
      cancelActiveAnim();
      const cancelRef = { cancelled: false };
      activeAnimCancelRef.current = cancelRef;
      animateScrollLeft(viewport, target, Math.min(animMs, 260), cancelRef);
    } else {
      viewport.scrollLeft = target;
    }
  };

  /* =========================
     ✅ TOUCH / MOUSE DRAG (Pointer Events)
     ========================= */
  useEffect(() => {
    const res = getEls();
    if (!res) return;
    const { viewport } = res;

    const applyDrag = () => {
      dragRafRef.current = null;
      const x = pendingXRef.current;
      if (x == null) return;

      const dx = x - dragStartXRef.current;
      viewport.scrollLeft = dragStartScrollLeftRef.current - dx;

      if (webMode === "continuous") {
        const ok = recompute();
        if (ok) {
          const setWidth = setWidthRef.current;
          const base = setStartRef.current;
          const rel = viewport.scrollLeft - base;
          const wrapped = ((rel % setWidth) + setWidth) % setWidth;
          viewport.scrollLeft = base + setWidth + wrapped;
        }
      } else {
        wrapRunwayDuringDrag(viewport);
      }
    };

    const queueDrag = (clientX: number) => {
      pendingXRef.current = clientX;
      if (dragRafRef.current == null) {
        dragRafRef.current = requestAnimationFrame(applyDrag);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (paused || !shouldRun) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      // ✅ stop any running animation IMMEDIATELY (biggest smoothness fix)
      cancelActiveAnim();

      draggingRef.current = true;
      stopResumeTimer();

      pointerIdRef.current = e.pointerId;
      viewport.setPointerCapture(e.pointerId);

      stopStep();
      stopContinuous();

      recompute();

      dragStartXRef.current = e.clientX;
      dragStartScrollLeftRef.current = viewport.scrollLeft;

      viewport.style.cursor = "grabbing";
      (document.body.style as any).userSelect = "none";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      if (pointerIdRef.current !== e.pointerId) return;

      // ✅ mobile browsers coalesce pointer events; use the latest sample
      const anyE = e as any;
      const coalesced: PointerEvent[] | undefined =
        typeof anyE.getCoalescedEvents === "function" ? anyE.getCoalescedEvents() : undefined;

      const clientX =
        coalesced && coalesced.length ? coalesced[coalesced.length - 1].clientX : e.clientX;

      queueDrag(clientX);
    };

    const endDrag = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      viewport.style.cursor = "";
      (document.body.style as any).userSelect = "";

      if (webMode === "step") {
        commitToNearest(viewport, true);
      }

      stopResumeTimer();
      resumeTimerRef.current = window.setTimeout(() => {
        setKick((k) => k + 1);
      }, 500);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch {}
      pointerIdRef.current = null;
      endDrag();
    };

    const onPointerCancel = () => {
      pointerIdRef.current = null;
      endDrag();
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerCancel);

    return () => {
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerCancel);

      stopResumeTimer();
      if (dragRafRef.current) cancelAnimationFrame(dragRafRef.current);
      dragRafRef.current = null;
    };
  }, [paused, shouldRun, webMode, animMs, childArray.length, repeatCount]);

  /* =========================
     CONTINUOUS (optional)
     ========================= */
  useEffect(() => {
    stopContinuous();

    if (paused || !shouldRun) return;
    if (webMode !== "continuous") return;

    stopStep();

    const res = getEls();
    if (!res) return;

    const { viewport } = res;
    let cancelled = false;

    const speed = direction === "left" ? 0.35 : -0.35;

    const tick = () => {
      if (cancelled) return;

      if (draggingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (!setWidthRef.current) {
        if (!recompute()) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
      }

      const setWidth = setWidthRef.current;
      const base = setStartRef.current;

      viewport.scrollLeft += speed;

      const rel = viewport.scrollLeft - base;
      const wrapped = ((rel % setWidth) + setWidth) % setWidth;
      viewport.scrollLeft = base + setWidth + wrapped;

      rafRef.current = requestAnimationFrame(tick);
    };

    waitForLayout(() => {
      rafRef.current = requestAnimationFrame(tick);
    });

    return () => {
      cancelled = true;
      stopContinuous();
    };
  }, [paused, shouldRun, webMode, direction, items.length, childArray.length, kick]);

  /* =========================
     STEP (true infinite)
     ========================= */
  useEffect(() => {
    stopStep();

    if (paused || !shouldRun) return;
    if (webMode !== "step") return;

    stopContinuous();

    const res = getEls();
    if (!res) return;

    const { viewport } = res;
    const cancelRef = { cancelled: false };

    const alignStartOnce = () => {
      if (initializedRef.current) return true;

      const ok = recompute();
      if (!ok) return false;

      const setWidth = setWidthRef.current;
      const positions = positionsRef.current;
      if (!setWidth || !positions.length) return false;

      idxRef.current = 0;
      cycleRef.current = Math.max(2, Math.floor(repeatCount / 2));
      viewport.scrollLeft = positions[0] + cycleRef.current * setWidth;

      keepScrollInMiddleBand(viewport);

      initializedRef.current = true;
      return true;
    };

    const runLoop = () => {
      if (cancelRef.cancelled || paused) return;

      timeoutRef.current = window.setTimeout(() => {
        if (draggingRef.current) {
          runLoop();
          return;
        }

        const ok = recompute();
        if (!ok) {
          runLoop();
          return;
        }

        const setWidth = setWidthRef.current;
        const positions = positionsRef.current;
        const n = positions.length;

        if (!setWidth || !n) {
          runLoop();
          return;
        }

        keepScrollInMiddleBand(viewport);

        if (direction === "left") {
          if (idxRef.current === n - 1) {
            idxRef.current = 0;
            cycleRef.current += 1;
          } else {
            idxRef.current += 1;
          }
        } else {
          if (idxRef.current === 0) {
            idxRef.current = n - 1;
            cycleRef.current -= 1;
          } else {
            idxRef.current -= 1;
          }
        }

        keepScrollInMiddleBand(viewport);

        const target = positions[idxRef.current] + cycleRef.current * setWidth;

        // ✅ cancel any previous animation before starting a new one
        cancelActiveAnim();
        const localAnimCancel = { cancelled: false };
        activeAnimCancelRef.current = localAnimCancel;

        animateScrollLeft(viewport, target, animMs, localAnimCancel);

        runLoop();
      }, pauseMs);
    };

    waitForLayout(() => {
      const ok = alignStartOnce();
      if (!ok) {
        runLoop();
        return;
      }
      runLoop();
    });

    return () => {
      cancelRef.cancelled = true;
      stopStep();
    };
  }, [
    paused,
    shouldRun,
    webMode,
    direction,
    pauseMs,
    animMs,
    items.length,
    childArray.length,
    repeatCount,
    kick,
  ]);

  return (
    <div
      className="cards recipe-cards"
      ref={viewportRef}
      style={{
        touchAction: "pan-y",
        cursor: "grab",
      }}
    >
      <div className="scroll recipe-scroll">
        {items.map((node, idx) => (
          <React.Fragment key={idx}>{node}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
