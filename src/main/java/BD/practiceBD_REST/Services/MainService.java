package BD.practiceBD_REST.Services;

import BD.practiceBD_REST.DAOs.*;
import BD.practiceBD_REST.Objects.*;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@Getter
public class MainService {

    private final MaintenanceDAO maintenanceDAO;
    private final SeatDAO seatDAO;
    private final EquipmentDAO equipmentDAO;
    private final AllocationDAO allocationDAO;
    private final ClassroomDAO classroomDAO;
    private final EquipmentTypeDAO equipmentTypeDAO;

    @Autowired
    public MainService(MaintenanceDAO maintenanceDAO, SeatDAO seatDAO, EquipmentDAO equipmentDAO, AllocationDAO allocationDAO, ClassroomDAO classroomDAO, EquipmentTypeDAO equipmentTypeDAO) {
        this.maintenanceDAO = maintenanceDAO;
        this.seatDAO = seatDAO;
        this.equipmentDAO = equipmentDAO;
        this.allocationDAO = allocationDAO;
        this.classroomDAO = classroomDAO;
        this.equipmentTypeDAO = equipmentTypeDAO;
    }

    // Methods for Maintenance
    public List<Maintenance> getAllMaintenances() throws DataAccessException {
        return maintenanceDAO.getAll();
    }

    public void  deleteMaintenance(int id) throws DataAccessException {
        maintenanceDAO.delete(id);
    }

    public int createMaintenance(Maintenance maintenance) throws DataAccessException {return maintenanceDAO.create(maintenance);}

    public void editMaintenance(Maintenance maintenance) throws DataAccessException {maintenanceDAO.edit(maintenance);}

    // Methods for Seat
    public List<Seat> getAllSeats() throws DataAccessException {
        return seatDAO.getAll();
    }

    public void deleteSeat(int id) throws DataAccessException {
        seatDAO.delete(id);
    }

    public int createSeat(Seat seat) throws DataAccessException {
        return seatDAO.create(seat);
    }

    public void editSeat(Seat seat) throws DataAccessException {
        seatDAO.edit(seat);
    }

    // Methods for Equipment
    public List<Equipment> getAllEquipment() throws DataAccessException {
        return equipmentDAO.getAll();
    }

    public int getEquipmentCount() throws DataAccessException {
        return equipmentDAO.count();
    }

    public void deleteEquipment(int id) throws DataAccessException {
        equipmentDAO.delete(id);
    }

    public int createEquipment(Equipment equipment) throws DataAccessException {
        return equipmentDAO.create(equipment);
    }

    public void editEquipment(Equipment equipment) throws DataAccessException {
        equipmentDAO.edit(equipment);
    }

    // Methods for Allocation
    public List<Allocation> getAllAllocations() throws DataAccessException {
        return allocationDAO.getAll();
    }

    public void deleteAllocation(int id) throws DataAccessException {
        allocationDAO.delete(id);
    }

    public int createAllocation(Allocation allocation) throws DataAccessException {
        return allocationDAO.create(allocation);
    }

    public void editAllocation(Allocation allocation) throws DataAccessException {
        allocationDAO.edit(allocation);
    }

    // Methods for Classroom
    public List<Classroom> getAllClassrooms() throws DataAccessException {
        return classroomDAO.getAll();
    }

    public void deleteClassroom(int id) throws DataAccessException {
        classroomDAO.delete(id);
    }

    public int createClassroom(Classroom classroom) throws DataAccessException {
        return classroomDAO.create(classroom);
    }

    public void editClassroom(Classroom classroom) throws DataAccessException {
        classroomDAO.edit(classroom);
    }

    // Methods for EquipmentType
    public List<EquipmentType> getAllEquipmentTypes() throws DataAccessException {
        return equipmentTypeDAO.getAll();
    }

    public void deleteEquipmentType(int id) throws DataAccessException {
        equipmentTypeDAO.delete(id);
    }

    public int createEquipmentType(EquipmentType equipmentType) throws DataAccessException {
        return equipmentTypeDAO.create(equipmentType);
    }

    public void editEquipmentType(EquipmentType equipmentType) throws DataAccessException {
        equipmentTypeDAO.edit(equipmentType);
    }

    public int getEquipmentTypesCount() throws DataAccessException {
        return equipmentTypeDAO.count();
    }

    // Requests
    public List<Seat> showListFaultySeats() throws DataAccessException {
        return seatDAO.getListFaultySeats();
    }

    public List<Equipment> showListFaultyEquipment() throws DataAccessException {
        return equipmentDAO.getListFaultyEquipment();
    }

    public List<Seat> showSeatsByEquipmentType(int id) throws DataAccessException {
        return seatDAO.getListSeatsByEquipmentType(id);
    }
}
