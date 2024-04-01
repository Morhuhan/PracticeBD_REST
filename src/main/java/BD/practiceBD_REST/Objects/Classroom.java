package BD.practiceBD_REST.Objects;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Classroom {

    private int id;

    private int id_allocation;

    private int current_num_of_places;

    private int max_num_of_places;

    private String department;

    private String note;
}
