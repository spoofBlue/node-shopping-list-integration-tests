
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
    
    it("should show an error when a name value is not given", function() {
        const newBadItem = {
            //name : "Kabob" ,
            ingredients : ["steak", "chicken", "cucumber", "potato"]
        };
        return chai.request(app)
        .post(`/recipes`)
        .send(newBadItem)
        .then(function(response) {
            throw new Error(`Failed case actually shows as an success.`);
        })
        .catch(function(error) {
            if (error.response) {
                expect(error).to.have.status(400);
            } else {
                throw error;
            }
         });
    });
    
});