const questions = [
  {
    key:"causes", title:"If you could make one thing better tomorrow, what would it be?",
    multi:true, options:["Animals","Children & families","Mental health","Addiction & recovery","Homelessness","Domestic violence","Veterans","Medical research","Education","Environment","Hunger & food security","Disaster relief"]
  },
  {
    key:"impact", title:"What kind of impact feels most meaningful to you?",
    multi:false, options:["Helping one person directly","Solving large-scale problems","Improving my local community","Funding research & innovation","Helping during emergencies","Creating long-term change"]
  },
  {
    key:"geography", title:"Where would you like your giving to happen?",
    multi:false, options:["Mostly local","Across the United States","Anywhere in the world","A mix of local, national & global"]
  },
  {
    key:"evidence", title:"What makes you feel like your donation actually mattered?",
    multi:true, options:["Seeing someone's life change","Knowing where the money went","Measurable results","Photos & stories","Emergency response","Long-term results","Supporting organizations doing work I couldn't do myself"]
  },
  {
    key:"involvement", title:"How involved do you want to be?",
    multi:false, options:["Just tell me where to give","Give me recommendations and I'll choose","I want updates on everything","I want an ongoing giving strategy"]
  },
  {
    key:"amount", title:"How much are you looking to give?",
    multi:false, options:["$100–$499","$500–$999","$1,000–$4,999","$5,000–$24,999","$25,000–$99,999","$100,000+"]
  }
];

let current=0, answers={};

function startQuiz(){
  document.getElementById("how").scrollIntoView();
  document.querySelector(".how").classList.add("hidden");
  document.querySelector(".hero").classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  renderQuestion();
  document.getElementById("quiz").scrollIntoView({behavior:"smooth"});
}

function renderQuestion(){
  const q=questions[current];
  document.getElementById("progressBar").style.width=((current)/questions.length*100)+"%";
  document.getElementById("quizCount").textContent=`QUESTION ${current+1} OF ${questions.length}`;
  const selected=answers[q.key]||[];
  document.getElementById("quizContent").innerHTML=`
    <h2 class="question">${q.title}</h2>
    <div class="options">${q.options.map((o,i)=>`
      <button class="option ${selected.includes(o)?"selected":""}" onclick="choose('${escapeQuotes(o)}',${q.multi})">${o}</button>
    `).join("")}</div>
    <div class="quiz-actions">
      <button class="back" onclick="previousQuestion()" ${current===0?"style='visibility:hidden'":""}>← Back</button>
      <button class="primary" onclick="nextQuestion()">Continue <span>→</span></button>
    </div>`;
}
function escapeQuotes(s){return s.replace(/'/g,"\\'")}
function choose(value,multi){
  const q=questions[current];
  if(multi){
    let arr=answers[q.key]||[];
    arr=arr.includes(value)?arr.filter(x=>x!==value):[...arr,value];
    answers[q.key]=arr;
  }else answers[q.key]=[value];
  renderQuestion();
}
function nextQuestion(){
  const q=questions[current];
  if(!answers[q.key] || answers[q.key].length===0){alert("Choose at least one answer to continue.");return}
  if(current<questions.length-1){current++;renderQuestion();window.scrollTo({top:0,behavior:"smooth"});}
  else showResults();
}
function previousQuestion(){if(current>0){current--;renderQuestion();window.scrollTo({top:0,behavior:"smooth"});}}
function showResults(){
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("results").classList.remove("hidden");
  const causes=answers.causes||[];
  let profile="The Purposeful Giver", intro="You want your money to reflect your values—not just go to the most familiar name.";
  if(causes.includes("Animals") && causes.length<=3){profile="The Protector";intro="Your giving is driven by compassion and a strong instinct to protect vulnerable lives."}
  else if(causes.includes("Mental health")||causes.includes("Addiction & recovery")){profile="The Compassionate Changemaker";intro="You’re drawn to causes that help people move from struggle toward stability, healing, and a better life."}
  else if(causes.includes("Environment")||causes.includes("Education")){profile="The Future Builder";intro="You’re motivated by creating conditions that make life better not just today, but for years to come."}
  else if((answers.impact||[])[0]==="Solving large-scale problems"){profile="The Systems Changer";intro="You want your giving to tackle big problems and support solutions that can reach many people."}
  document.getElementById("profileName").textContent=profile;
  document.getElementById("profileIntro").textContent=intro;
  const ranked=[...causes,...["Local community","Emergency relief","Research & innovation"]].filter((x,i,a)=>a.indexOf(x)===i).slice(0,5);
  const weights=[34,24,18,14,10];
  document.getElementById("priorityList").innerHTML=ranked.map((x,i)=>`<div class="priority"><span>${x}</span><span>${weights[i]||10}%</span></div>`).join("");
  document.getElementById("portfolio").innerHTML=ranked.map((x,i)=>`<div class="portfolio-row"><span>${x}</span><strong>${weights[i]||10}%</strong></div>`).join("");
  window.scrollTo({top:0,behavior:"smooth"});
}
function restartQuiz(){current=0;answers={};document.getElementById("results").classList.add("hidden");document.getElementById("quiz").classList.remove("hidden");renderQuestion();window.scrollTo({top:0,behavior:"smooth"});}
