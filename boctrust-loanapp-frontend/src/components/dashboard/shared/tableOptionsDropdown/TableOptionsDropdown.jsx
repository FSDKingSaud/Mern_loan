import { IoEllipsisVertical } from "react-icons/io5";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import styles from "./tableOptionsDropdown.module.css";
import { useOnClickOutside } from "../../../../../hooks/useOnclickOutside";
import PageLoader from "../PageLoader";

const TableOptionsDropdown = ({ items }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const ref = useRef(null);

  useOnClickOutside(ref, () => setShowDropdown(false));
  return (
    <div className={styles.options__wrapper}>
      <button
        className="btn btn-light"
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <IoEllipsisVertical />
      </button>
      {showDropdown && (
        <div ref={ref} className={styles.options__dropdown}>
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => item.func()}
              className={` ${item.className}`}
              disabled={item?.isDisabled || false}
            >
              {item?.isLoading && <PageLoader width="10" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

TableOptionsDropdown.propTypes = {
  items: PropTypes.array,
  loan: PropTypes.object,
};

export default TableOptionsDropdown;
