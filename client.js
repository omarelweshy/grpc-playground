const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];
const client = new todoPackage.Todo(
    "localhost:5000",
    grpc.credentials.createInsecure()
);

client.createTodo(
    {
        id: -1,
        text: text,
    },
    (err, res) => {
        process.exit(0);
    }
);

const call = client.readTodosStream();
call.on("data", (item) => {
    console.log("Recieved item from server " + JSON.stringify(item));
});
call.on("end", (e) => console.log("server Done!"));
