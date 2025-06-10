import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPermissions,
  fetchRolesAndPermisions,
  updateRole,
} from "../../../../redux/reducers/adminUserReducer";

import "./CreateNewAdmin.css";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";

const ManageAccessControl = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { rolesAndPermission, allPermisions } = useSelector(
    (state) => state.adminUserReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      dispatch(fetchRolesAndPermisions());
      dispatch(fetchPermissions());
    };

    getData();
  }, []);

  const handleUpdateRole = async () => {
    try {
      setIsLoading(true);

      await dispatch(
        updateRole({
          payload: selectedRole,
          roleId: selectedRole._id,
        })
      );

      await dispatch(fetchRolesAndPermisions());
      toast.success("Role Permission has been updated");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (permission) => {
    if (!selectedRole) return;
    const canList = [...selectedRole.can];
    const index = canList.indexOf(permission);
    if (index > -1) {
      canList.splice(index, 1);
    } else {
      canList.push(permission);
    }
    setSelectedRole({
      ...selectedRole,
      can: canList,
    });
  };
  const handleNotSeeChange = (permission) => {
    if (!selectedRole) return;
    const shouldNotSeeList = [...selectedRole.shouldNotSee];
    const index = shouldNotSeeList.indexOf(permission);
    if (index > -1) {
      shouldNotSeeList.splice(index, 1);
    } else {
      shouldNotSeeList.push(permission);
    }
    setSelectedRole({
      ...selectedRole,
      shouldNotSee: shouldNotSeeList,
    });
  };

  return (
    <div className="manage__accessControl">
      <div className=" border p-3">
        {rolesAndPermission && (
          <div className="FieldGroup">
            <label htmlFor="userRole">User Roles</label>
            <select
              onChange={(e) => {
                setSelectedRole(
                  rolesAndPermission?.find(
                    (item) => item.value == e.target.value
                  )
                );
              }}
              name="userRole"
              id="userRole"
              className="Input"
            >
              <option value="">Select Role</option>
              {rolesAndPermission.map((option) => (
                <option key={option._id} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedRole && allPermisions && (
        <div className="permission__control border p-3">
          <h4>Permission Control</h4>

          <div>
            <h5>KYC</h5>
            <div>
              {allPermisions.kyc.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    checked={selectedRole?.can.includes(item)}
                    id={item}
                    onChange={() => handleChange(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>Loans</h5>
            <div>
              {allPermisions.loan.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    checked={selectedRole?.can.includes(item)}
                    id={item}
                    onChange={() => handleChange(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>Top Up Loan</h5>
            <div>
              {allPermisions?.topUpLoan.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    checked={selectedRole?.can.includes(item)}
                    id={item}
                    onChange={() => handleChange(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>Remita</h5>
            <div>
              {allPermisions.remita.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    id={item}
                    onChange={() => handleChange(item)}
                    checked={selectedRole?.can.includes(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>Credit Assessment</h5>
            <div>
              {allPermisions.credit.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    id={item}
                    onChange={() => handleChange(item)}
                    checked={selectedRole?.can.includes(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>Employer Manager</h5>
            <div>
              {allPermisions.employer.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    id={item}
                    onChange={() => handleChange(item)}
                    checked={selectedRole?.can.includes(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>Website Manager</h5>
            <div>
              {allPermisions.webManager.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    onChange={() => handleChange(item)}
                    checked={selectedRole?.can.includes(item)}
                    id={item}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>User Manager</h5>
            <div>
              {allPermisions.user.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedRole?.can.includes(item)}
                    value={item}
                    id={item}
                    onChange={() => handleChange(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>Setting</h5>
            <div>
              {allPermisions.setting.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    checked={selectedRole?.can.includes(item)}
                    id={item}
                    onChange={() => handleChange(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5>Branches</h5>
            <div>
              {allPermisions.branches.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    checked={selectedRole?.can.includes(item)}
                    id={item}
                    onChange={() => handleChange(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-danger">User Should Not See</h5>
            <div>
              {allPermisions?.shouldNotSee.map((item, index) => (
                <div
                  key={index}
                  className="form-check d-flex gap-3 align-items-center"
                >
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={item}
                    checked={selectedRole?.shouldNotSee.includes(item)}
                    id={item}
                    onChange={() => handleNotSeeChange(item)}
                  />
                  <label className="form-check-label" htmlFor={item}>
                    {item}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={handleUpdateRole}
              className="btn btn-primary w-25 text-center"
            >
              {isLoading ? <PageLoader width="16px" /> : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAccessControl;
