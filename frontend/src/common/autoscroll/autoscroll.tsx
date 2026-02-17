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

export default function AutoScrollCards({
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

  const idxRef = useRef(0);
  const baseRef = useRef(0);

  const setWidthRef = useRef<number>(0);
  const setStartRef = useRef<number>(0);
  const positionsRef = useRef<number[]>([]);

  // ✅ interaction
  const draggingRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  // smooth drag
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const pendingXRef = useRef<number | null>(null);
  const dragRafRef = useRef<number | null>(null);

  // ✅ kick auto effects to restart cleanly after drag
  const [kick, setKick] = useState(0);

  // ✅ prevent alignStart() from resetting after drag
  const initializedRef = useRef(false);

  const childArray = useMemo(() => React.Children.toArray(children), [children]);
  const shouldRun = mobileOnly ? isMobile : true;

  const repeatCount = useMemo(() => {
    const n = childArray.length;
    if (!shouldRun) return 1;
    if (n <= 3) return 6;
    if (n <= 6) return 4;
    return 2;
  }, [childArray.length, shouldRun]);

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
    const scrollRow = viewport.querySelector<HTMLDivElement>(".scroll");
    if (!scrollRow) return null;
    return { viewport, scrollRow };
  };

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

    const first = firstSet[0];
    const last = firstSet[n - 1];

    const viewportW = viewport.clientWidth;

    const setStart = first.offsetLeft;
    setStartRef.current = setStart;

    const positions = firstSet.map((el) => {
      const centerX = el.offsetLeft - setStart + el.offsetWidth / 2;
      return centerX - viewportW / 2;
    });

    const setWidth = last.offsetLeft + last.offsetWidth - first.offsetLeft;
    if (!setWidth || setWidth < 1) return false;

    setWidthRef.current = setWidth;
    positionsRef.current = positions;
    return true;
  };

  // keep positions updated
  useEffect(() => {
    if (paused || !shouldRun) return;

    const res = getEls();
    if (!res) return;

    const { scrollRow } = res;

    waitForLayout(() => {
      recompute();
    });

    const ro = new ResizeObserver(() => recompute());
    ro.observe(scrollRow);

    return () => ro.disconnect();
  }, [paused, shouldRun, items.length, childArray.length]);

  /**
   * ✅ commit where user ended up + snap (step mode)
   * + keep it inside middle band so next auto-step never "adds late".
   */
  const commitToNearest = (opts?: { animate?: boolean }) => {
    const res = getEls();
    if (!res) return;

    const { viewport } = res;
    const ok = recompute();
    if (!ok) return;

    const setWidth = setWidthRef.current;
    const setStart = setStartRef.current;
    const positions = positionsRef.current;
    if (!setWidth || !positions.length) return;

    const x = viewport.scrollLeft - setStart;
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

    baseRef.current = cycle * setWidth;
    idxRef.current = bestIdx;

    // ✅ keep in a safe middle band (prevents edge behavior on mobile)
    {
      const min = setStart + setWidth * 0.25;
      const max = setStart + setWidth * 1.75;
      while (viewport.scrollLeft < min) {
        viewport.scrollLeft += setWidth;
        baseRef.current += setWidth;
      }
      while (viewport.scrollLeft > max) {
        viewport.scrollLeft -= setWidth;
        baseRef.current -= setWidth;
      }
    }

    if (opts?.animate) {
      const cancelRef = { cancelled: false };
      animateScrollLeft(
        viewport,
        baseRef.current + setStart + positions[bestIdx],
        Math.min(animMs, 260),
        cancelRef
      );
    }
  };

  // ✅ Pointer drag (smooth)
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
          const setStart = setStartRef.current;
          let rel = viewport.scrollLeft - setStart;
          rel = ((rel % setWidth) + setWidth) % setWidth;
          viewport.scrollLeft = setStart + rel;
        }
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

      draggingRef.current = true;
      stopResumeTimer();

      pointerIdRef.current = e.pointerId;
      viewport.setPointerCapture(e.pointerId);

      stopStep();
      stopContinuous();

      dragStartXRef.current = e.clientX;
      dragStartScrollLeftRef.current = viewport.scrollLeft;

      viewport.style.cursor = "grabbing";
      (document.body.style as any).userSelect = "none";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      if (pointerIdRef.current !== e.pointerId) return;
      queueDrag(e.clientX);
    };

    const endDrag = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;

      viewport.style.cursor = "";
      (document.body.style as any).userSelect = "";

      if (webMode === "step") {
        commitToNearest({ animate: true });
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
  }, [paused, shouldRun, webMode, direction, animMs, childArray.length]);

  /* =========================
     CONTINUOUS
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

    const start = () => {
      if (cancelled) return;

      if (!setWidthRef.current || setWidthRef.current < 1) {
        const ok = recompute();
        if (!ok) {
          rafRef.current = requestAnimationFrame(start);
          return;
        }
      }

      const tick = () => {
        if (cancelled) return;

        if (draggingRef.current) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const setWidth = setWidthRef.current;
        if (!setWidth || setWidth < 1) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        viewport.scrollLeft += speed;

        const setStart = setStartRef.current;
        let x = viewport.scrollLeft - setStart;
        x = ((x % setWidth) + setWidth) % setWidth;
        viewport.scrollLeft = setStart + x;

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    waitForLayout(start);

    return () => {
      cancelled = true;
      stopContinuous();
    };
  }, [paused, shouldRun, webMode, direction, items.length, childArray.length, kick]);

  /* =========================
     STEP
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

      idxRef.current = 0;
      baseRef.current = direction === "left" ? 0 : setWidthRef.current;

      const positions = positionsRef.current;
      if (!positions.length) return false;

      viewport.scrollLeft = baseRef.current + setStartRef.current + positions[0];
      initializedRef.current = true;
      return true;
    };

    // ✅ NEW: keep scroll in middle band BEFORE we advance,
    // so you never "reach end then add".
    const keepInMiddleBand = () => {
      const setWidth = setWidthRef.current;
      if (!setWidth || setWidth < 1) return;

      const setStart = setStartRef.current;

      // keep scrollLeft in a safe range inside duplicated runway
      const min = setStart + setWidth * 0.25;
      const max = setStart + setWidth * 1.75;

      while (viewport.scrollLeft < min) {
        viewport.scrollLeft += setWidth;
        baseRef.current += setWidth;
      }
      while (viewport.scrollLeft > max) {
        viewport.scrollLeft -= setWidth;
        baseRef.current -= setWidth;
      }
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

        const positions = positionsRef.current;
        const setWidth = setWidthRef.current;
        const n = positions.length;

        if (!n || !setWidth) {
          runLoop();
          return;
        }

        // ✅ KEY FIX: pre-normalize BEFORE changing idx
        keepInMiddleBand();

        if (direction === "left") {
          idxRef.current++;
          if (idxRef.current >= n) {
            idxRef.current = 0;
            baseRef.current += setWidth;
          }
        } else {
          idxRef.current--;
          if (idxRef.current < 0) {
            idxRef.current = n - 1;
            baseRef.current -= setWidth;
          }
        }

        // ✅ normalize again after base changes
        keepInMiddleBand();

        animateScrollLeft(
          viewport,
          baseRef.current + setStartRef.current + positions[idxRef.current],
          animMs,
          cancelRef
        );

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
    kick,
  ]);

  return (
    <div
      className="cards"
      ref={viewportRef}
      style={{
        touchAction: "pan-y",
        cursor: "grab",
      }}
    >
      <div className="scroll">
        {items.map((node, idx) => (
          <React.Fragment key={idx}>{node}</React.Fragment>
        ))}
      </div>
    </div>
  );
}
