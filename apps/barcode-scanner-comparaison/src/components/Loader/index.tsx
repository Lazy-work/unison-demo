"use unison";

import cx from "classnames";
import { CSSTransition } from "react-transition-group";

import { LOADER_COLOR } from "../constants/loader";

import styles from "./styles.module.scss";
import {
  computed,
  reactRef,
  ref,
  watchPostEffect,
} from "@unisonjs/vue";

type Props = {
  color?: LOADER_COLOR;
  show: boolean;
};

const Loader: React.FC<Props> = (props: Props) => {
  const showLoader = ref(false);
  const nodeRef = reactRef(null);

  watchPostEffect(() => {
    showLoader.value = props.show;
  });

  const className = computed(() =>
    cx(styles.lds_ellipsis, {
      [styles.primary]: !props.color || props.color === LOADER_COLOR.PRIMARY,
      [styles.white]: props.color === LOADER_COLOR.WHITE,
    }),
  );

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={showLoader.value}
      timeout={300}
      unmountOnExit
      classNames={{
        enter: styles.backdropEnter,
        enterActive: styles.backdropEnterActive,
        exit: styles.backdropExit,
        exitActive: styles.backdropExitActive,
      }}
    >
      <div ref={nodeRef} className={styles.backdrop}>
        <div className={className.value}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Loader;
