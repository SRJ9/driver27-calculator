# `driver27-calculator` — Calculate the champion

Calculator allows to calculate to calculate the final classification of a racing championship from the current standing 
through a form where you can predict the results of the remaining races. Calculator is an [AngularJS] app based on
[django-driver27].

## Getting Started

Simply execute `npm start` and node server will be opened in port 8080.

### Understanding standing-demo.json

**name**, **last_name**, **team** are understood by themselves  
**points** are the points of contender in origin  
**pos_str** is a string with the positions x times (fill with zeros until 3 digits) to order in case of draw. 
e.g: 001000004 = (1st once, 3rd x 4 times). All contenders pos_str must contain the same length to order efficiently.  
**total_points** is the **points** value plus the points added by calculator  
**total_str** is the same that pos_str plus the positions added by calculator. In case of draw, the contender with best
total_str will be the champions.

### to-Do

- [x] Move standing JSON to file standing-demo.json
- [x] Create factory to connect driver27 API (use custom params)
- [ ] Switch button to use standing.json or dr27 API response
- [ ] Alert when position is repeated by two contenders in same race
- [ ] Modularize the APP
- [ ] Punctuation system logic could be in the API side or use Flask
- [ ] TypeScript
- [ ] Convert to Angular2 APP (To evaluate)

[angularjs]: https://angularjs.org/
[django-driver27]: https://github.com/SRJ9/django-driver27