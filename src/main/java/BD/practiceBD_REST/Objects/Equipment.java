package BD.practiceBD_REST.Objects;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Equipment {

    private int id;

    private int id_equipmentType;

    private int inv_number;

    private int p_i;

    private String note;
}
