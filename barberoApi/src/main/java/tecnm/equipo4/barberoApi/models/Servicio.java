package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "servicio")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idServicio")
    private Long idServicio;

    @Column(name = "nombreServicio", nullable = false)
    private String nombreServicio;

    @Column(name = "duracion")
    private Integer duracion;

    @Column(name = "precio", nullable = false)
    @Digits(integer = 6, fraction = 2)
    private BigDecimal precio;

    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Turno> turnos = new ArrayList<>();
}