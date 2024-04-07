package BD.practiceBD_REST.Controllers;

import BD.practiceBD_REST.Services.MainService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Setter
@Getter
public class MainController {

    public final MainService mainService;

    public MainController(MainService mainService) {
        this.mainService = mainService;
    }

    @GetMapping("/maintenance")
    public String showServiceForm(Model model) {
        model.addAttribute("seats", mainService.getAllSeats());
        model.addAttribute("Equipment", mainService.getAllEquipment(10, 1));
        model.addAttribute("maintenances", mainService.getAllMaintenances());
        return "maintenanceForm.html";
    }

    @GetMapping("/classroom")
    public String showClassroomForm(Model model) {
        model.addAttribute("classrooms", mainService.getAllClassrooms());
        model.addAttribute("allocations", mainService.getAllAllocations());
        return "classroomForm.html";
    }

    @GetMapping("/allocation")
    public String showAllocationForm(Model model) {
        model.addAttribute("allocations", mainService.getAllAllocations());
        return "allocationForm.html";
    }

    @GetMapping("/equipment")
    public String showEquipmentForm(Model model) {
        int countOnPage = 10;
        model.addAttribute("Equipment", mainService.getAllEquipment(countOnPage, 1));
        model.addAttribute("Equipment_count_on_page", countOnPage);
        model.addAttribute("Equipment_count_in_table", mainService.getEquipmentCount());
        model.addAttribute("equipmentTypes", mainService.getAllEquipmentTypes());
        return "equipmentForm.html";
    }

    @GetMapping("/equipmentType")
    public String showEquipmentTypeForm(Model model) {
        model.addAttribute("equipmentTypes", mainService.getAllEquipmentTypes());
        return "equipmentTypeForm.html";
    }

    @GetMapping("/seat")
    public String showSeatForm(Model model) {
        model.addAttribute("seats", mainService.getAllSeats());
        model.addAttribute("classrooms", mainService.getAllClassrooms());
        return "seatForm.html";
    }

    ////////// REQUESTS

    @GetMapping("/admin")
    public String showAdminForm(Model model) {
        model.addAttribute("equipmentTypes", mainService.getAllEquipmentTypes());
        return "adminForm.html";
    }
}
