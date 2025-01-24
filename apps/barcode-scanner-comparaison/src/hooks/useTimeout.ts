import { ref, onUnmounted, watchEffect, Ref, unref, onWatcherCleanup } from "@unisonjs/vue";

export function useTimeout(delay: Ref<number> | number = 0, active: Ref<boolean> | boolean = true) {
  const elapsed = ref(!active);
  const timer = ref<number | null>(null);

  function action() {
    const timeout = setTimeout(() => {
      elapsed.value = true;
      clearTimeout(timeout);
      timer.value = null;
    }, unref(delay));
    timer.value = timeout;
  }

  function cancel() {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }
    elapsed.value = false;
  }

  function reset() {
    cancel();
    action();
  }

  watchEffect(() => {
    if (unref(active)) {
      action();
    }

    onWatcherCleanup(() => {
      cancel();
    })
  });

  return [elapsed, cancel, reset] as const;
}
