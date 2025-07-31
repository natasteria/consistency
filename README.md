# consistency
Concepts Learned During the project: 

1. Event listener stacking.
  - Event listeners persist once added — they are not removed automatically after a function finishes running.
  - If addEventListener is placed inside a function that is called multiple times, it attaches a new listener each time, leading to stacked (duplicated) handlers
  - This results in the event triggering multiple times (e.g. double, triple execution)
  - Scope doesn't clean up listeners — even if the listener is declared inside a function, it stays attached to the element because event listeners are stored by the browsers.
  - Event listeners are removed only if the Dom element is removed or explicity by using removeEventListener.