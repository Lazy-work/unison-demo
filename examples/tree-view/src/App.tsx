import { computed, ref } from "@unisonjs/vue";
import "./App.css";

export interface TreeItemModel {
  name: string;
  children?: TreeItemModel[];
}

export interface TreeItemProps {
  model: TreeItemModel;
  className?: string;
}
function TreeItem(props: TreeItemProps) {
  const { model } = props;
  const isOpen = ref(false);
  const isFolder = computed(() => model.children && model.children.length > 0);

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function changeType() {
    if (!isFolder.value) {
      model.children = [];
      addChild();
      isOpen.value = true;
    }
  }

  function addChild() {
    model.children?.push({ name: "new stuff" });
  }

  return (
    <li>
      <div
        className={isFolder.value ? "bold" : ""}
        onClick={toggle}
        onDoubleClick={changeType}
      >
        {model.name}
        {isFolder.value && <span>{isOpen.value ? "-" : "+"}</span>}
      </div>
      {isOpen.value && isFolder.value && (
        <ul>
          {model.children?.map((child, index) => (
            <TreeItem key={index} model={child} className="item" />
          ))}
          <li className="add" onClick={addChild}>
            +
          </li>
        </ul>
      )}
    </li>
  );
}
function App() {
  const treeData = ref({
    name: "My Tree",
    children: [
      { name: "hello" },
      { name: "world" },
      {
        name: "child folder",
        children: [
          {
            name: "child folder",
            children: [{ name: "hello" }, { name: "world" }],
          },
          { name: "hello" },
          { name: "world" },
          {
            name: "child folder",
            children: [{ name: "hello" }, { name: "world" }],
          },
        ],
      },
    ],
  });

  return (
    <div>
      <ul>
        <TreeItem model={treeData.value} className="item" />
      </ul>
    </div>
  );
}

export default App;
