package BD.practiceBD_REST.Controllers;

import BD.practiceBD_REST.Objects.*;
import BD.practiceBD_REST.Services.MainService;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Setter
@Getter
public class JsonController {

    private final MainService mainService;

    @Autowired
    public JsonController(MainService mainService) {
        this.mainService = mainService;
    }

    @PostMapping("/maintenance/{id_maintenance}/delete")
    public ResponseEntity<?> deleteMaintenance(@PathVariable("id_maintenance") int id_maintenance) {
        try {
            mainService.deleteMaintenance(id_maintenance);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    @PostMapping("/maintenance/create")
    public ResponseEntity<String> createMaintenance(@RequestBody Maintenance maintenance) {
        try {
            int id = mainService.createMaintenance(maintenance);
            return ResponseEntity.ok(String.valueOf(id));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/maintenance/{id_maintenance}/edit")
    public ResponseEntity<String> editMaintenance(@RequestBody Maintenance maintenance) {
        try {
            mainService.editMaintenance(maintenance);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/allocation/{id_allocation}/delete")
    public ResponseEntity<?> deleteAllocation(@PathVariable("id_allocation") int id_allocation) {
        try {
            mainService.deleteAllocation(id_allocation);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/allocation/create")
    public ResponseEntity<String> createAllocation(@RequestBody Allocation allocation) {
        try {
            int id = mainService.createAllocation(allocation);
            return ResponseEntity.ok(String.valueOf(id));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/allocation/{id_allocation}/edit")
    public ResponseEntity<String> editAllocation(@RequestBody Allocation allocation) {
        try {
            mainService.editAllocation(allocation);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/classroom/{id_classroom}/delete")
    public ResponseEntity<?> deleteClassroom(@PathVariable("id_classroom") int id_classroom) {
        try {
            mainService.deleteClassroom(id_classroom);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/classroom/create")
    public ResponseEntity<String> createClassroom(@RequestBody Classroom classroom) {
        try {
            int id = mainService.createClassroom(classroom);
            return ResponseEntity.ok(String.valueOf(id));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/classroom/{id_classroom}/edit")
    public ResponseEntity<String> editClassroom(@RequestBody Classroom classroom) {
        try {
            mainService.editClassroom(classroom);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/equipment/{id_equipment}/delete")
    public ResponseEntity<?> deleteEquipment(@PathVariable("id_equipment") int id_equipment) {
        try {
            mainService.deleteEquipment(id_equipment);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/equipment/create")
    public ResponseEntity<String> createEquipment(@RequestBody Equipment equipment) {
        try {
            int id = mainService.createEquipment(equipment);
            return ResponseEntity.ok(String.valueOf(id));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/equipment/{id_equipment}/edit")
    public ResponseEntity<String> editEquipment(@RequestBody Equipment equipment) {
        try {
            mainService.editEquipment(equipment);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/equipmentType/{id_equipmentType}/delete")
    public ResponseEntity<?> deleteEquipmentType(@PathVariable("id_equipmentType") int id_equipmentType) {
        try {
            mainService.deleteEquipmentType(id_equipmentType);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/equipmentType/create")
    public ResponseEntity<String> createEquipmentType(@RequestBody EquipmentType equipmentType) {
        try {
            int id = mainService.createEquipmentType(equipmentType);
            return ResponseEntity.ok(String.valueOf(id));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/equipmentType/{id_equipmentType}/edit")
    public ResponseEntity<String> editEquipmentType(@RequestBody EquipmentType equipmentType) {
        try {
            mainService.editEquipmentType(equipmentType);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/seat/{id_seat}/delete")
    public ResponseEntity<?> deleteSeat(@PathVariable("id_seat") int id_seat) {
        try {
            mainService.deleteSeat(id_seat);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/seat/create")
    public ResponseEntity<String> createSeat(@RequestBody Seat seat) {
        try {
            int id = mainService.createSeat(seat);
            return ResponseEntity.ok(String.valueOf(id));
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/seat/{id_seat}/edit")
    public ResponseEntity<String> editSeat(@RequestBody Seat seat) {
        try {
            mainService.editSeat(seat);
            return ResponseEntity.ok().build();
        } catch (DataAccessException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
