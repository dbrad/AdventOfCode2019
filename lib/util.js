let container;
export function write(message) {
  if(!container) {
    container = document.querySelector(".container");
  }
  const div = document.createElement("div");
  div.innerHTML = message;
  container.appendChild(div);
}

export async function printFile(fileNmae) {
  const response = await fetch(fileNmae);
  const fileContents = await response.text();
  const formatted = fileContents.replace(/[<]/g, "&lt;").replace(/[>]/g, "&gt;");
  write(`<pre>// ${fileNmae}\n${formatted}</pre>`);
}

export function assertEquals(a, b, description = "") {
  if (a === b) {
    write(`<span class="pass">&check;</span> ${description} should be ${b}`);
  } else {
    write(`<span class="fail">&cross;</span> ${description} should be ${b} (was ${a})`);
  }
}
