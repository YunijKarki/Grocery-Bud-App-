import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
const List = ({ lists, deleteList, editList }) => {
  return (
    <div>
      {lists.map((list, listIndex) => {
        const { _id, title } = list;
        return (
          <article className="grocery-item">
            <p>{title}</p>
            <div className="btn-container">
              <FaEdit
                onClick={() => {
                  editList(_id);
                }}
                className="edit-btn"
              ></FaEdit>
              <FaTrash
                className="delete-btn"
                onClick={() => {
                  deleteList(_id);
                }}
              ></FaTrash>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default List;
