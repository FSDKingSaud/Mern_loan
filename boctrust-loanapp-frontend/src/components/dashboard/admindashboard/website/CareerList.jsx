import { useEffect, useState } from "react";
import { fetchCareer } from "../../../../redux/reducers/careerReducer";
import Table from "react-bootstrap/Table";
import PageLoader from "../../shared/PageLoader";
import ActionNotification from "../../shared/ActionNotification";
import "../../Dashboard.css";
import EditCareer from "./EditCareer";
import NoResult from "../../../shared/NoResult";
// functions
import getDateOnly from "../../../../../utilities/getDate";
import apiClient from "../../../../lib/axios";
// import searchList from "../../../../../utilities/searchListFunc";
import { MdEdit } from "react-icons/md";

// custom hook
import NextPreBtn from "../../shared/NextPreBtn";
import { useDebounce } from "../../../../../utilities/debounce";
import TableOptionsDropdown from "../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { GrView } from "react-icons/gr";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";

const CareerList = ({ showCount, searchTerms }) => {
  const [openModel, setOpenModel] = useState(false);
  const [action, setAction] = useState(false);
  const [actionOption, setActionOption] = useState("");
  const [careerObj, setCareerObj] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [careerList, setCareerList] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchTerms, 3000);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        let url = `/career/all-careers`;

        if (showCount) {
          url += `?limit=${showCount}`;
        }

        if (debouncedSearch) {
          url += `&search=${debouncedSearch}`;
        }

        if (currentPage) {
          url += `&page=${currentPage}`;
        }

        const {
          data: { data, totalPages },
        } = await apiClient.get(url);

        setCareerList(data);
        setTotalPages(totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [debouncedSearch, showCount, currentPage]);

  // handle edit action
  const handleEdit = () => {
    setOpenModel(true);
  };

  // handle delete action
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setAction(false);
      await apiClient.delete(`/career/careers/${careerObj._id}`);

      dispatch(fetchCareer());
      toast.success("Post Deleted Successfully");
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.error || "Could not perform delete");
    } finally {
      setAction(false);
      setIsLoading(true);
    }
  };

  const styles = {
    head: {
      color: "#145098",
      fontSize: "1.2rem",
      backgroudColor: "#f9f9f9",
    },
    select: {
      backgroundColor: "#ecaa00",
      color: "#fff",
      border: "none",
      fontSize: "1rem",
      marginTop: "0.1rem",
      padding: "0.2rem 0.5rem",
    },
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getTableOptions = (career) => {
    const tableOptions = [
      {
        className: "",
        icon: <GrView />,
        label: "View Details",
        func: () => {
          setCareerObj(career);
          handleEdit();
        },
      },
      {
        className: "text-primary",
        icon: <MdEdit />,
        label: "Edit",

        func: () => {
          setCareerObj(career);
          handleEdit();
          setActionOption("edit");
        },
      },
      {
        className: "text-danger",
        icon: <FcCancel />,
        label: "Delete",

        func: () => {
          setCareerObj(career);
          setAction(true);
        },
      },
    ];

    return tableOptions;
  };

  return (
    <>
      {isLoading || !careerList ? (
        <PageLoader />
      ) : (
        <div className="ListSec">
          <div style={styles.table}>
            <Table hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Jobs</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {careerList?.length === 0 && <NoResult name="jobs" />}
                {careerList?.map((jobs) => (
                  <tr key={jobs._id}>
                    <td>{jobs.jobtitle}</td>
                    <td>{jobs.description.slice(0, 60)}....</td>
                    <td>{getDateOnly(jobs.dateposted)}</td>
                    <td>
                      <TableOptionsDropdown items={getTableOptions(jobs)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <NextPreBtn
            currentPage={currentPage}
            totalPages={totalPages}
            goToPreviousPage={goToPreviousPage}
            goToNextPage={goToNextPage}
          />
        </div>
      )}

      <EditCareer
        onHide={() => setOpenModel(false)}
        show={openModel}
        career={careerObj}
        option={actionOption}
      />
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

export default CareerList;
