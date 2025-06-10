import { useEffect, useState } from "react";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import RoleList from "./RoleList";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addNewRole,
  fetchRolesAndPermisions,
  updateRole,
} from "../../../../redux/reducers/adminUserReducer";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";

// toast styles
import "react-toastify/dist/ReactToastify.css";

import usePagination from "../../../../customHooks/usePagination";

const roleInputInit = {
  label: "",
  description: "",
};

const ManageUserRole = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [showCount, setShowCount] = useState(10);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerms, setSearchTerms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newRoleInput, setNewRoleInput] = useState(roleInputInit);

  const [totalPages, setTotalPages] = useState(5); 

  // from usePagination
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);

  const handleAddNew = () => setShowAddNew(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedRole) {
      setNewRoleInput({
        label: selectedRole.label,
        description: selectedRole?.description || "",
      });
    }
  }, [selectedRole]);

  const handleAddRole = async () => {
    try {
      setIsLoading(true);

      const res = await dispatch(
        addNewRole({
          ...newRoleInput,
          value: newRoleInput.label.trim().split(" ").join("_").toLowerCase(),
        })
      );

      if (res.type.includes("rejected")) {
        return toast.error(res?.payload || "Something went wrong");
      }

      await dispatch(fetchRolesAndPermisions());
      toast.success("Role has been Added");
      setNewRoleInput(roleInputInit);
      setShowAddNew(false);
    } catch (error) {
      toast.error("Something Went Wrong");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    try {
      setIsLoading(true);

      await dispatch(
        updateRole({
          payload: {
            ...newRoleInput,
            value: newRoleInput.label.split(" ").join("_").toLowerCase(),
          },
          roleId: selectedRole._id,
        })
      );

      await dispatch(fetchRolesAndPermisions());
      toast.success("Role has been updated");
      setNewRoleInput(roleInputInit);
      setSelectedRole(null);
      setShowAddNew(false);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="MainBox">
      <div className="BlogSection">
        <div className="AddBtn">
          <BocButton func={handleAddNew} bgcolor="#ecaa00" bradius="22px">
            <div className="d-flex gap-1 align-items-center">
              <span>+</span> Add New Role
            </div>
          </BocButton>
        </div>
        {/* top search bar */}
        <div className="Search">
          <DashboardHeadline
            mspacer="40px 0"
            padding="0"
            height="70px"
            bgcolor="#d9d9d9"
          >
            <div className="SearchBar">
              <div className="FormGroup">
                <label htmlFor="show">Show</label>
                <input
                  name="showCount"
                  type="number"
                  step={10}
                  min={10}
                  value={showCount}
                  onChange={(e) => setShowCount(e.target.value)}
                />
              </div>

              <div className="FormGroup SBox">
                <input
                  name="search"
                  placeholder="Search"
                  value={searchTerms}
                  onChange={(e) => setSearchTerms(e.target.value)}
                />
                <img src="/images/search.png" alt="search-icon" />
              </div>
            </div>
          </DashboardHeadline>
        </div>
        <div>
          {/* users list  */}
          <RoleList
            count={showCount}
            setIsEditMode={(role) => {
              setSelectedRole(role);
              setShowAddNew(true);
            }}
            searchTerms={searchTerms}
          />
          {/* next and previous button  */}
          <NextPreBtn
            currentPage={currentPage}
            totalPages={totalPages}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
          />
        </div>
      </div>

      <div>
        <Modal show={showAddNew} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>{"Create New Role"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="new__roleForm">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={newRoleInput.label}
                  onChange={(e) =>
                    setNewRoleInput({
                      ...newRoleInput,
                      label: e.target.value,
                    })
                  }
                  aria-describedby="name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  aria-label="description"
                  value={newRoleInput.description}
                  onChange={(e) =>
                    setNewRoleInput({
                      ...newRoleInput,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddNew(false);
                setNewRoleInput(roleInputInit);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={selectedRole ? handleUpdateRole : handleAddRole}
            >
              {isLoading ? <PageLoader width="16px" /> : "Save"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUserRole;
