import React, { useState, useEffect } from "react";
import axios from "axios";
import List from "./List";
import Alert from "./Alert";

function App() {
  const [lists, setLists] = useState([]);
  const [inputs, setInputs] = useState("");
  const [editId, setEditId] = useState(null);
  const [editState, setEditState] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const loadData = async () => {
    const response = await fetch("http://localhost:5000");
    const lists = await response.json();
    setLists(lists);
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputs) {
      setAlert({ show: true, msg: "Pleae Enter the Value", type: "danger" });
    } else if (inputs && editState === true) {
      // you need editstate anyhow
      setLists(
        lists.map((list) => {
          if (list._id === editId) {
            return { ...list, title: inputs };
          } else {
            return list;
          }
        })
      );
      //  post to the server to have selected items edited
      axios
        .post("http://localhost:5000/api/edit", {
          editId: editId,
          title: inputs,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      setInputs("");
      showAlert(true, "Contents edited", "success");
      setEditId(null);
      setEditState(false);
    } else {
      const newItems = { _id: new Date().getTime().toString(), title: inputs };
      setAlert({ show: true, msg: "Items added", type: "success" });
      setLists([...lists, newItems]);
      setInputs("");

      // 'post' request to server to add new todo list
      axios
        .post("http://localhost:5000/api/add", newItems)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const showAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };

  const editList = (_id) => {
    const pickList = lists.find((list) => list._id === _id);
    setEditId(_id);
    setEditState(true);
    setInputs(pickList.title);
  };

  const deleteList = (_id) => {
    axios
      .post("http://localhost:5000/api/delete", {
        _id: _id,
        title: "Clear Items",
      }) //* have to pass in objects
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    setAlert({
      show: true,
      msg: "Deleted items successfully",
      type: "success",
    });
    setLists((prevList) => {
      return prevList.filter((list) => {
        return list._id !== _id;
      });
    });
  };

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} />}
        <h3>Grocery Bud</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g.eggs"
            value={inputs}
            onChange={(events) => {
              setInputs(events.target.value);
            }}
          ></input>
          <button type="submit" className="submit-btn">
            {editState ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {lists.length > 0 && (
        <div className="grocery-container">
          <List lists={lists} deleteList={deleteList} editList={editList} />

          <button
            className="clear-btn"
            onClick={() => {
              axios
                .post("http://localhost:5000/api/deletemany")
                .then((response) => {
                  console.log(response);
                })
                .catch((err) => {
                  console.log(err);
                });
              setAlert({
                show: true,
                msg: "Cleared all items.",
                type: "danger",
              });
              setLists([]);
            }}
          >
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}
export default App;
