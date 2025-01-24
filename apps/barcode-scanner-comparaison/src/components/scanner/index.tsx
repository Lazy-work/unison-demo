"use unison"
import {
  ref,
  watch,
  onMounted,
  onUnmounted,
  computed,
  reactive,
  watchEffect,
  reactRef,
  watchPostEffect,
  onWatcherCleanup,
} from "@unisonjs/vue";
import { ChangeEvent, CSSProperties } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import { useScanner } from "../../hooks/useScanner";
import PhotoPicker from "../PhotoPicker";
import { useTimeout } from "../../hooks/useTimeout";
import styles from "./styles.module.scss";
import { SCANNER_TYPE } from "../../barcodeScanner/BarcodeScanner";

interface IProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  enableCamera?: boolean;
  onCode?: (code: string | null) => void;
  file?: File;
}

export default function Scanner(props: IProps) {
  const onCode = props.onCode;

  const {
    code,
    position,
    start,
    stop,
    scanFile,
    changeScanner,
    scannerType,
    cameraAvailable,
    isSupported,
    disable,
    enable,
    error,
  } = useScanner("reader");

  const detected = ref(false);
  const timeout = ref<number | null>(null);
  const currentFile = ref(props.file || null);
  watchEffect(() => {
    currentFile.value = props.file || null;
  })
  const [isReady, _, wait] = useTimeout(3 * 1000, false);
  const highlight = reactRef(null);
  const DURATION = 300;[]

  watchPostEffect(() => {
    if (props.enableCamera && cameraAvailable.value) {
      start();
    }
  });

  onUnmounted(() => {
    stop();
  })


  watchEffect(() => {
    if (!isReady.value) {
      disable();
    } else if (props.enableCamera) {
      enable();
    }
  });

  watchEffect(() => {
    if (currentFile.value) {
      scanFile(currentFile.value);
    }
  });

  function onChangePhoto(newFile: File | null) {
    currentFile.value = newFile;
  }

  function onChangeScanner(event: ChangeEvent<HTMLSelectElement>) {
    changeScanner(event.target.value as SCANNER_TYPE);
  }

  watchEffect(() => {
    if (error.value) {
      console.error(error.value);
    }
  });

  watchEffect(() => {
    if (code.value) {
      if (timeout.value) clearTimeout(timeout.value);
      detected.value = true;
    } else if (detected.value) {
      timeout.value = setTimeout(() => {
        detected.value = false;
      }, 1000);
    }
  });

  const x1 = computed(() => position.value?.topRight.x || 0);
  const x2 = computed(() => position.value?.topLeft.x || 0);

  const displayCode = computed(
    () => cameraAvailable.value || currentFile.value,
  );

  return (
    <>
      <PhotoPicker
        className={classNames({
          [styles.hide]: cameraAvailable.value && props.enableCamera,
        })}
        onChange={onChangePhoto}
        file={currentFile.value}
      />

      <div
        id="reader"
        className={classNames(styles.scanner, {
          [styles.hide]: !cameraAvailable.value || !props.enableCamera,
        })}
        style={{ width: props.width, height: props.height }}
      >
        <img id="preview" className={styles.preview} />
      </div>

      {displayCode.value && (
        <p className={styles.code}>
          Code : <b>{code.value || "Aucun code"}</b>
        </p>
      )}

      <select
        defaultValue={scannerType.value}
        className={styles.scannerChanger}
        onChange={onChangeScanner}
      >
        <option
          value={SCANNER_TYPE.NATIVE}
          disabled={!isSupported(SCANNER_TYPE.NATIVE)}
        >
          Native {!isSupported(SCANNER_TYPE.NATIVE) && "(unsupported)"}
        </option>
        <option value={SCANNER_TYPE.ZXING}>Wasm (zxing)</option>
      </select>

      <CSSTransition
        in={!!code.value}
        timeout={DURATION}
        unmountOnExit
        nodeRef={highlight}
        classNames={{
          enter: styles.highlightCodeEnter,
          enterActive: styles.highlightCodeActive,
          exit: styles.highlightCodeExit,
          exitActive: styles.highlightCodeExitActive,
        }}
      >
        <div
          className={styles.highlightCode}
          ref={highlight}
          style={{
            top: position.value?.topLeft.y,
            left: position.value?.topLeft.x,
            width: x1.value - x2.value,
          }}
        />
      </CSSTransition>
    </>
  );
}
