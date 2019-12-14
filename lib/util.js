let container;
export function write(message) {
  if (!container) {
    container = document.querySelector(".container");
  }
  const div = document.createElement("div");
  div.innerHTML = message;
  container.appendChild(div);
}

export function append(element) {
  if (!container) {
    container = document.querySelector(".container");
  }
  container.appendChild(element);
}

export async function printFile(fileName) {
  const response = await fetch(fileName);
  const fileContents = await response.text();
  const formatted = fileContents.replace(/[<]/g, "&lt;").replace(/[>]/g, "&gt;");

  const button = document.createElement("button");
  button.innerHTML = fileName;
  button.classList.add("collapser");

  const code = document.createElement("pre");
  code.innerHTML = `// ${fileName}\n${formatted}`;

  button.addEventListener("click", function() {
    button.classList.toggle("active");
    if (code.style.maxHeight) {
      code.style.padding = "0px 15px"
      code.style.maxHeight = null;
    } else {
      code.style.padding = "15px"
      code.style.maxHeight = code.scrollHeight + 30 + "px";
    }
  });
  append(button);
  append(code);
}

export function assertEquals(a, b, description = "") {
  if (JSON.stringify(a) === JSON.stringify(b)) {
    write(`<span class="pass">&check;</span> ${description} should be ${b}`);
  } else {
    write(`<span class="fail">&cross;</span> ${description} should be ${b} (was ${a})`);
  }
}

BigInt.prototype.toJSON = function() {
  return this.toString();
};