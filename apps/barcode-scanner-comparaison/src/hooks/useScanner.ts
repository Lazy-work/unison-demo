import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  computed,
  Ref,
  unref,
  watchEffect,
  onWatcherCleanup
} from "@unisonjs/vue";
import BarcodeScanner, {
  BarcodeResult,
  SCANNER_TYPE,
} from "../barcodeScanner/BarcodeScanner";
import ScannerSingleton from "../barcodeScanner/ScannerSingleton";

const cameraAvailable = BarcodeScanner.cameraAvailable();

export function useScanner(elementId: Ref<string> | string) {
  const code = ref<string | null>(null);
  const scannerType = ref<SCANNER_TYPE>(SCANNER_TYPE.ZXING);
  const position = ref<BarcodeResult["position"] | null>(null);
  const error = ref<Error | null>(null);
  const failCamera = ref(false);
  const scanner = ref<BarcodeScanner | null>(null);

  function onScanSuccess(result: BarcodeResult | null) {
    code.value = result?.text ?? null;
    if (result && result.text !== "") {
      position.value = result.position;
    }
  }

  function onScanFailure(qrError: Error) {
    error.value = qrError;
  }

  watchEffect(() => {
    ScannerSingleton.getInstance(unref(elementId), onScanSuccess, onScanFailure).then(
      (instance) => {
        scanner.value = instance;
        scannerType.value = instance.getScannerType();
      },
    );

    onWatcherCleanup(() => {
      ScannerSingleton.destroyInstance();
      scanner.value = null;
    })
  });

  function start() {
    scanner.value?.render().catch(() => {
      failCamera.value = true;
    });
  }

  function stop() {
    scanner.value?.stop();
  }

  function reset() {
    code.value = null;
    error.value = null;
    position.value = null;
  }

  const isCameraAvailable = computed(
    () => cameraAvailable && !failCamera.value,
  );

  function scanFile(file: File) {
    scanner.value?.scanFile(file).then(onScanSuccess).catch(onScanFailure);
  }

  function enable() {
    scanner.value?.enable();
  }

  function disable() {
    scanner.value?.disable();
  }

  function isSupported(type: SCANNER_TYPE) {
    return scanner.value?.isSupported(type) ?? false;
  }

  watchEffect(() => {
    scanner.value?.changeScanner(scannerType.value);
  });

  function changeScanner(type: SCANNER_TYPE) {
    scannerType.value = type;
  }

  return {
    code,
    position,
    error,
    isEnable: computed(() => !!scanner.value?.isEnable),
    enable,
    disable,
    start,
    stop,
    reset,
    scanFile,
    changeScanner,
    isSupported,
    scannerType,
    cameraAvailable: isCameraAvailable,
  };
}
