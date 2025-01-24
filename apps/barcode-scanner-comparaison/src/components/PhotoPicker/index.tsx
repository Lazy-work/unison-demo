"use unison"
import { Icon } from "@iconify/react";
import { ChangeEvent } from "react";

import Loader from "../Loader";
import { fileToImage } from "../../utils";

import styles from "../PhotoPicker/styles.module.scss";
import classNames from "classnames";
import { computed, ref, watch, watchEffect } from "@unisonjs/vue";

type PhotoPickerProps = {
  file?: File | null;
  onChange: (file: File | null) => void;
  className?: string;
};

const PhotoPicker = (props: PhotoPickerProps) => {
  const currentFile = ref<File | null>(props.file || null);
  const previewImage = ref<string | null>(null);
  const loading = ref(false);

  watch(currentFile, (newFile) => {
    if (newFile) {
      loading.value = true;
      fileToImage(newFile).then((data) => {
        previewImage.value = data.src;
        loading.value = false;
        props.onChange(newFile);
      });
    }
  });

  const handleOnFileChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    if (file) {
      currentFile.value = file;
    }
  };

  const inputFileClass = computed(() => classNames(styles.inputFile, props.className));

  return (
    <label className={inputFileClass.value}>
      <Loader show={loading.value} />
      {!previewImage.value && (
        <div className={styles.picker}>
          <div tabIndex={-1} role="button" className={styles.btnFile}>
            <Icon
              icon="material-symbols:add-a-photo"
              color="#186860"
              width="48"
              height="48"
            />
          </div>
          <p>Prendre en photo le code barre</p>
          <p>(Attention à ce qu'il soit nettement visible)</p>
        </div>
      )}
      {previewImage.value && (
        <>
          <img
            className={styles.scannerPreview}
            src={previewImage.value}
            alt="preview"
          />
          <div className={styles.picker}>
            <div tabIndex={-1} role="button" className={styles.btnFile}>
              <Icon
                icon="material-symbols:edit"
                color="white"
                width="48"
                height="48"
              />
            </div>
            <p>Modifier la photo</p>
          </div>
        </>
      )}
      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleOnFileChange}
      />
    </label>
  );
};

export default PhotoPicker;
