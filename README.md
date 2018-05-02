Shopping list v5
================

https://github.com/Thinkful-Ed/node-shopping-list-v5

* Serves client that:
    + makes AJAX calls back to API endpoints to initially retrieve and display existing recipes and shopping list.
    + allows users to add, check/uncheck, and delete shopping list items
    + allows users to add and delete recipes
* Uses `express.Router` to route requests for `/recipes` and `/shopping-list` to separate modules.
* CRUD (create, read, update, delete) operations for recipes and shopping list
* Note: uses volatile, in memory storage, since we haven't studied data persistence yet in the course.


Cory's edit 5/1/18: Code for tests-for-recipes.js below

const chai = require(`chai`);
const chaiHttp = require(`chai-http`);

const {app, runServer, closeServer} = require(`../server`);


const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipes", function() {

    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    // For GET
    it("should get recipe list", function() {
        return chai.request(app)
        .get(`/recipes`)
        .then(function(response) {
            expect(response).to.have.status(200);
            expect(response).to.be.json;
            expect(response.body).to.be.an(`array`);
            expect(response.body.length).to.be.at.least(1);

            const requiredFields = [`name`, `id`, `ingredients`];
            response.body.forEach(function(item) {
                expect(item).to.be.an(`object`);
                expect(item).to.have.all.keys(requiredFields);
                expect(item.ingredients).to.be.an(`array`);
            });
        });
    });

    // For POST
    it("should post a recipe into list", function() {
        const newItem = {
            name : "Kabob" ,
            ingredients : ["steak", "chicken", "cucumber", "potato"]
        };
        return chai.request(app)
        .post(`/recipes`)
        .send(newItem)
        .then(function(response) {
            expect(response).to.have.status(201);
            expect(response).to.be.json;
            expect(response.body).to.be.an(`object`);

            const requiredFields = [`name`, `id`, `ingredients`];
            expect(response.body).to.include.keys(requiredFields);
            expect(response.body.id).not.to.equal(null);
            expect(response.body).to.deep.equal(Object.assign(newItem, {id: response.body.id}));
        });
    });

    // For PUT
    it("should update the selected recipe already on the list with PUT", function() {
        const updatedItem = {
            name : "Kabob" ,
            ingredients : ["steak", "chicken", "cucumber", "potato"]
        };

        return chai.request(app)
        .get('/recipes')
        .then(function(response) {
            updatedItem.id = response.body[0].id;
            return chai.request(app)
            .put(`/recipes/${updatedItem.id}`)
            .send(updatedItem);
        })
        .then(function(response) {
            expect(response).to.have.status(204);
        });
    });

    // For DELETE
    it("should delete the selected recipe already on the list", function() {
        return chai.request(app)
        .get(`/recipes`)
        .then(function(response) {
            const removeThisId = response.body[0].id
            return chai.request(app)
            .delete(`/recipes/${removeThisId}`);
        })
        .then(function(response) {
            expect(response).to.have.status(204);
        });
    });

    // For important edge case in POST
    /** 
    it("should show an error when a name value is not given", function() {
        const newBadItem = {
            ingredients : ["rock", "paper", "scissors"]
        };
        return chai.request(app)
        .post(`/recipes`)
        .send(newBadItem)
        .then(function(response) {
            console.log(`333333333333333333333333333`);
            expect(response).to.throw(error);
            const requiredFields = [`name`, `id`, `ingredients`];
            expect(response.body).not.to.include.keys(requiredFields);
        });   
    });
    **/
});
